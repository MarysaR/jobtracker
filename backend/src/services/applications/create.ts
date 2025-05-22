import {
  ValidationError,
  DatabaseError,
} from "../../errorHandling/genericError";
import {
  validateCreateApplication,
  CreateApplicationData,
} from "../../validators/application.validator";
import { createApplication } from "../../repositories/application.repository";
import { Result } from "../../errorHandling";

export const createApplicationService = async (
  body: any
): Promise<Result<any, ValidationError | DatabaseError>> => {
  const validationResult = validateCreateApplication(body);

  if (validationResult.isErr()) {
    return validationResult;
  }

  const createResult = await createApplication(validationResult.value);

  return createResult;
};
