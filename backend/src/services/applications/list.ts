import { Err, Ok, Result } from "../../errorHandling";
import { DatabaseError } from "../../errorHandling/genericError";
import {
  findManyApplications,
  countApplications,
} from "../../repositories/application.repository";

interface ApplicationWithPagination {
  applications: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const listApplicationsService = async (
  query: any,
  userId: string // AJOUTER LE USERID
): Promise<Result<ApplicationWithPagination, DatabaseError>> => {
  const { page = 1, limit = 10, statut, sourceReseau } = query;

  const where: any = {
    userId: userId,
  };

  if (statut) where.statut = statut;
  if (sourceReseau) where.sourceReseau = sourceReseau;

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const applicationsResult = await findManyApplications({
    where,
    skip,
    take,
    orderBy: {
      dateCandidature: "desc",
    },
  });

  if (applicationsResult.isErr()) {
    return Err.of(applicationsResult.error);
  }

  const totalResult = await countApplications({ where });
  if (totalResult.isErr()) {
    return Err.of(totalResult.error);
  }

  const data: ApplicationWithPagination = {
    applications: applicationsResult.value,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: totalResult.value,
      pages: Math.ceil(totalResult.value / Number(limit)),
    },
  };

  return Ok.of(data);
};
