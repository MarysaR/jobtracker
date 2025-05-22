const { PrismaClient } = require("@prisma/client");
import { Result, Ok, Err } from "../errorHandling";
import { DatabaseError } from "../errorHandling/genericError";

const prisma = new PrismaClient();

export const createApplication = async (
  data: any
): Promise<Result<any, DatabaseError>> => {
  const result = await prisma.application.create({ data });
  if (result) {
    return Ok.of(result);
  }
  return Err.of(new DatabaseError("Failed to create application"));
};

export const findManyApplications = async (
  params: any
): Promise<Result<any[], DatabaseError>> => {
  const result = await prisma.application.findMany(params);
  if (result) {
    return Ok.of(result);
  }
  return Err.of(new DatabaseError("Failed to fetch applications"));
};

export const countApplications = async (
  params: any
): Promise<Result<number, DatabaseError>> => {
  const result = await prisma.application.count(params);
  if (typeof result == "number") {
    return Ok.of(result);
  }
  return Err.of(new DatabaseError("Failed to count applications"));
};

export const updateApplication = async (
  id: string,
  data: any
): Promise<Result<any, DatabaseError>> => {
  const result = await prisma.application.update({
    where: { id },
    data,
  });
  if (result) {
    return Ok.of(result);
  }
  return Err.of(new DatabaseError("Failed to update application"));
};

export const findApplicationById = async (
  id: string
): Promise<Result<any, DatabaseError>> => {
  const result = await prisma.application.findUnique({
    where: { id },
  });
  if (result) {
    return Ok.of(result);
  }
  return Err.of(new DatabaseError("Application not found"));
};

export const deleteApplication = async (
  id: string
): Promise<Result<any, DatabaseError>> => {
  const result = await prisma.application.delete({
    where: { id },
  });
  if (result) {
    return Ok.of(result);
  }
  return Err.of(new DatabaseError("Failed to delete application"));
};
