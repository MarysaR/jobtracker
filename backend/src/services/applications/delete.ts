import { Result, Err } from "../../errorHandling";
import { DatabaseError } from "../../errorHandling/genericError";
import {
  deleteApplication,
  findApplicationById,
} from "../../repositories/application.repository";

export const deleteApplicationService = async (
  id: string,
  userId: string
): Promise<Result<any, DatabaseError>> => {
  const existingResult = await findApplicationById(id);
  if (existingResult.isErr()) {
    return Err.of(new DatabaseError("Application not found"));
  }

  const application = existingResult.value;
  if (application.userId !== userId) {
    return Err.of(new DatabaseError("Application not found"));
  }

  const deleteResult = await deleteApplication(id);
  return deleteResult;
};
