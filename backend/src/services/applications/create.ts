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
  body: any,
  userId: string
): Promise<Result<any, ValidationError | DatabaseError>> => {
  const validationResult = validateCreateApplication(body);
  if (validationResult.isErr()) {
    return validationResult;
  }

  // AJOUTER userId aux données validées
  const dataWithUserId = {
    ...validationResult.value,
    userId: userId,
  };

  const createResult = await createApplication(dataWithUserId);
  return createResult;
};
