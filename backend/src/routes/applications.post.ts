import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { createApplicationService } from "../services/applications/create";

export const postApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("POST /api/applications called with body:", req.body);

  const result = await createApplicationService(req.body);

  console.log("Service result:", result);

  if (result.isOk()) {
    res.status(HTTP_STATUS.CREATED).json(result.value);
  } else {
    console.log("Error occurred:", result.error);
    const statusCode =
      result.error.name == "ValidationError"
        ? HTTP_STATUS.BAD_REQUEST
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
      error: result.error.message,
    });
  }
};
