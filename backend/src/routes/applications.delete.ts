import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { deleteApplicationService } from "../services/applications/delete";

export const deleteApplication = async (
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

  const result = await deleteApplicationService(id);

  if (result.isOk()) {
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } else {
    const statusCode =
      result.error.message == "Application not found"
        ? HTTP_STATUS.NOT_FOUND
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      error: result.error.message,
    });
  }
};
