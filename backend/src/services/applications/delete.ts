import { Result, Err } from "../../errorHandling";
import { DatabaseError } from "../../errorHandling/genericError";
import {
  deleteApplication,
  findApplicationById,
} from "../../repositories/application.repository";

export const deleteApplicationService = async (
  id: string
): Promise<Result<any, DatabaseError>> => {
  // Check if application exists
  const existingResult = await findApplicationById(id);
  if (existingResult.isErr()) {
    return Err.of(new DatabaseError("Application not found"));
  }

  // Delete application
  const deleteResult = await deleteApplication(id);
  return deleteResult;
};
