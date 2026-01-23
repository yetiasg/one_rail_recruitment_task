import type { Express, Request, Response } from "express";

export function mountHealth(app: Express) {
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok" as const,
      timestamp: new Date().toISOString(),
      uptimeSec: Math.floor(process.uptime()),
    });
  });
}
