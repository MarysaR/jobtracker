export {};
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      googleId?: string;
      avatarUrl?: string;
      password?: string;
      resetToken?: string;
      resetTokenExpiry?: Date;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}
