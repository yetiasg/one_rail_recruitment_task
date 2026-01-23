import { withTimeout } from "@shared/helpers/with-timeout";
import type { Express, Request, Response } from "express";
import type { Sequelize } from "sequelize";

type Status = "ok" | "fail";

type CheckResult = {
  status: Status;
  latencyMs: number;
  error?: string;
};

async function pingMysql(sequelize: Sequelize): Promise<void> {
  await sequelize.query("SELECT 1");
}

export function mountReadiness(app: Express, deps: { sequelize: Sequelize }) {
  app.get("/readiness", async (_req: Request, res: Response) => {
    const start = Date.now();
    const checks: Record<string, CheckResult> = {};
    let overall: Status = "ok";

    try {
      await withTimeout(pingMysql(deps.sequelize), 500);
      checks.mysql = { status: "ok", latencyMs: Date.now() - start };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      overall = "fail";
      checks.mysql = {
        status: "fail",
        latencyMs: Date.now() - start,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: e?.message ?? "unknown error",
      };
    }

    res.status(overall === "ok" ? 200 : 503).json({
      status: overall,
      timestamp: new Date().toISOString(),
      uptimeSec: Math.floor(process.uptime()),
      checks,
    });
  });
}
