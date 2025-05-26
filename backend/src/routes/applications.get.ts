import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { listApplicationsService } from "../services/applications/list";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const getApplications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const result = await listApplicationsService(req.query, userId);

  if (result.isOk()) {
    res.status(HTTP_STATUS.OK).json(result.value);
  } else {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: result.error.message,
    });
  }
};
