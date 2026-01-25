import { sequelize } from "@infrastructure/db/sequelize.instance";
import { redisStore } from "@infrastructure/redis/redis";
import { withTimeout } from "@shared/utils/with-timeout";
import type { Express, Request, Response } from "express";
import Keyv from "keyv";
import type { Sequelize } from "sequelize";

type Status = "ok" | "fail";

type CheckResult = {
  status: Status;
  latencyMs: number;
  error?: string;
};

type Service = "mysql" | "redis";

async function pingMysql(sequelize: Sequelize): Promise<void> {
  await sequelize.authenticate();
}

async function pingRedis(redisStore: Keyv): Promise<void> {
  const key = "__readiness__:redis";
  const value = Date.now().toString();

  await redisStore.set(key, value, 1000);
  const got = await redisStore.get<string>(key);

  if (got !== value) {
    throw new Error("Redis readiness failed: read-after-write mismatch");
  }
}

type ServiceCheck = {
  service: Service;
  checkCb: () => Promise<void>;
  result: CheckResult;
};

const serviceChecks: ServiceCheck[] = [
  {
    service: "mysql",
    checkCb: () => withTimeout(pingMysql(sequelize), 500),
    result: {
      status: "fail",
      latencyMs: 0,
      error: undefined,
    },
  },
  {
    service: "redis",
    checkCb: () => withTimeout(pingRedis(redisStore), 500),
    result: {
      status: "fail",
      latencyMs: 0,
      error: undefined,
    },
  },
];

export function mountReadiness(app: Express) {
  app.get("/readiness", async (_req: Request, res: Response) => {
    let overall: Status = "ok";

    for (const serviceCheck of serviceChecks) {
      const start = Date.now();

      try {
        await serviceCheck.checkCb();
        serviceCheck.result = { status: "ok", latencyMs: Date.now() - start };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        overall = "fail";
        serviceCheck.result = {
          status: "fail",
          latencyMs: Date.now() - start,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          error: e?.message ?? "unknown error",
        };
      }
    }

    res.status(overall === "ok" ? 200 : 503).json({
      status: overall,
      timestamp: new Date().toISOString(),
      uptimeSec: Math.floor(process.uptime()),
      checks: serviceChecks.map((check) => ({ [check.service]: check.result })),
    });
  });
}
