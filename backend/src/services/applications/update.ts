import { Result, Err } from "../../errorHandling";
import {
  ValidationError,
  DatabaseError,
} from "../../errorHandling/genericError";
import { validateUpdateApplication } from "../../validators/application.validator";
import {
  updateApplication,
  findApplicationById,
} from "../../repositories/application.repository";

export const updateApplicationService = async (
  id: string,
  body: any
): Promise<Result<any, ValidationError | DatabaseError>> => {
  const existingResult = await findApplicationById(id);
  if (existingResult.isErr()) {
    return Err.of(new DatabaseError("Application not found"));
  }

  const validationResult = validateUpdateApplication(body);
  if (validationResult.isErr()) {
    return validationResult;
  }

  const updateResult = await updateApplication(id, validationResult.value);
  return updateResult;
};
