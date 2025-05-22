const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
import { Result, Ok, Err } from "../../errorHandling";
import {
  DatabaseError,
  ValidationError,
} from "../../errorHandling/genericError";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

// Types
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Utilitaires
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Services avec Result pattern
export const findUserByEmail = async (
  email: string
): Promise<Result<any, DatabaseError>> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return Ok.of(user);
};

export const createUserWithEmail = async (
  data: RegisterData
): Promise<Result<any, DatabaseError | ValidationError>> => {
  // Vérifier si l'email existe déjà
  const existingUserResult = await findUserByEmail(data.email);
  if (existingUserResult.isOk() && existingUserResult.value) {
    return Err.of(new ValidationError("Email already exists"));
  }

  // Hash du password
  const hashedPassword = await hashPassword(data.password);

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      emailVerified: false,
    },
  });

  if (user) {
    return Ok.of(user);
  }
  return Err.of(new DatabaseError("Failed to create user"));
};

export const authenticateUser = async (
  data: LoginData
): Promise<Result<any, ValidationError | DatabaseError>> => {
  // Trouver l'utilisateur
  const userResult = await findUserByEmail(data.email);
  if (userResult.isErr() || !userResult.value) {
    return Err.of(new ValidationError("Invalid email or password"));
  }

  const user = userResult.value;

  // Vérifier le password
  if (!user.password) {
    return Err.of(
      new ValidationError("User registered with Google, use Google login")
    );
  }

  const isValidPassword = await comparePassword(data.password, user.password);
  if (!isValidPassword) {
    return Err.of(new ValidationError("Invalid email or password"));
  }

  return Ok.of(user);
};

export const generatePasswordResetToken = async (
  email: string
): Promise<Result<string, ValidationError | DatabaseError>> => {
  // Trouver l'utilisateur
  const userResult = await findUserByEmail(email);
  if (userResult.isErr() || !userResult.value) {
    return Err.of(new ValidationError("Email not found"));
  }

  // Générer le token
  const resetToken = generateResetToken();
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

  // Sauvegarder le token
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  if (updatedUser) {
    return Ok.of(resetToken);
  }
  return Err.of(new DatabaseError("Failed to generate reset token"));
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<Result<any, ValidationError | DatabaseError>> => {
  // Trouver l'utilisateur avec le token valide
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(), // Token non expiré
      },
    },
  });

  if (!user) {
    return Err.of(new ValidationError("Invalid or expired reset token"));
  }

  // Hash du nouveau password
  const hashedPassword = await hashPassword(newPassword);

  // Mettre à jour le password et supprimer le token
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  if (updatedUser) {
    return Ok.of(updatedUser);
  }
  return Err.of(new DatabaseError("Failed to reset password"));
};
