const express = require("express");
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import {
  createUserWithEmail,
  authenticateUser,
  generatePasswordResetToken,
  resetPassword,
  findUserByEmail, // Ajout pour récupérer le nom de l'utilisateur
} from "../../services/auth/email-auth";
import { emailService } from "../../services/email/email-service"; // Import du service email

const router = express.Router();

// POST /auth/register - Inscription email/password
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Email, password and name are required",
    });
  }

  const result = await createUserWithEmail({ email, password, name });

  if (result.isOk()) {
    // Connecter automatiquement l'utilisateur
    req.login(result.value, (err) => {
      if (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          error: "Registration successful but login failed",
        });
      }
      res.status(HTTP_STATUS.CREATED).json({
        message: "User created successfully",
        user: result.value,
      });
    });
  } else {
    const statusCode =
      result.error.name === "ValidationError"
        ? HTTP_STATUS.BAD_REQUEST
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
      error: result.error.message,
    });
  }
});

// POST /auth/login - Connexion email/password
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Email and password are required",
    });
  }

  const result = await authenticateUser({ email, password });

  if (result.isOk()) {
    // Connecter l'utilisateur
    req.login(result.value, (err) => {
      if (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          error: "Authentication successful but login failed",
        });
      }
      res.json({
        message: "Login successful",
        user: result.value,
      });
    });
  } else {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: result.error.message,
    });
  }
});

// POST /auth/forgot-password - Demande reset password
router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Email is required",
    });
  }

  const result = await generatePasswordResetToken(email);

  if (result.isOk()) {
    // Récupérer les infos utilisateur pour l'email
    const userResult = await findUserByEmail(email);

    if (userResult.isOk() && userResult.value) {
      const user = userResult.value;
      const resetToken = result.value;

      // Envoyer l'email de réinitialisation
      const emailSent = await emailService.sendResetPasswordEmail(
        email,
        user.name,
        resetToken
      );

      if (emailSent) {
        console.log(`📧 Email de reset envoyé à ${email}`);
        res.json({
          message: "Password reset email sent",
        });
      } else {
        console.error(`❌ Échec envoi email à ${email}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          error: "Failed to send reset email",
        });
      }
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "User not found",
      });
    }
  } else {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: result.error.message,
    });
  }
});

// POST /auth/reset-password - Reset password avec token
router.post("/reset-password", async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: "Token and password are required",
    });
  }

  const result = await resetPassword(token, password);

  if (result.isOk()) {
    res.json({
      message: "Password reset successful",
    });
  } else {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: result.error.message,
    });
  }
});

export default router;
