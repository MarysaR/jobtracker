import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { createApplicationService } from "../services/applications/create";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const postApplication = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const result = await createApplicationService(req.body, userId);

  if (result.isOk()) {
    res.status(HTTP_STATUS.CREATED).json(result.value);
  } else {
    const statusCode =
      result.error.name === "ValidationError"
        ? HTTP_STATUS.BAD_REQUEST
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      error: result.error.message,
    });
  }
};
