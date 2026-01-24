import { sequelize } from "@infrastructure/db/sequelize.instance";
import { withTimeout } from "@shared/infrastructure/with-timeout";
import type { Express, Request, Response } from "express";
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

async function pingRedis(sequelize: Sequelize): Promise<void> {
  await sequelize.query("SELECT 1");
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
    checkCb: () => withTimeout(pingRedis(sequelize), 500),
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
