import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { updateApplicationService } from "../services/applications/update";

export const putApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Application ID is required",
    });
    return;
  }

  const result = await updateApplicationService(id, req.body);

  if (result.isOk()) {
    res.status(HTTP_STATUS.OK).json(result.value);
  } else {
    const statusCode =
      result.error.name == "ValidationError"
        ? HTTP_STATUS.BAD_REQUEST
        : result.error.message == "Application not found"
        ? HTTP_STATUS.NOT_FOUND
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      error: result.error.message,
    });
  }
};
