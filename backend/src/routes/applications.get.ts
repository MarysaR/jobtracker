import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { listApplicationsService } from "../services/applications/list";

export const getApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await listApplicationsService(req.query);

  if (result.isOk()) {
    res.status(HTTP_STATUS.OK).json(result.value);
  } else {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: result.error.message,
    });
  }
};
