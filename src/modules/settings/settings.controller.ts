import { Request, Response } from "express";
import { settingsService } from "./settings.service";


export const getSettings = async (req: Request, res: Response) => {
  try {
    const result = await settingsService.getSettings();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Failed to fetch settings",
      details: error.message,
    });
  }
};

export const upsertSettings = async (req: Request, res: Response) => {
  try {
    const result = await settingsService.upsertSettings(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: "Settings update failed",
      details: error.message,
    });
  }
};
