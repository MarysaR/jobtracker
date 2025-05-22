import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface ResetPasswordEmailData {
  name: string;
  resetUrl: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private async sendEmail(options: EmailOptions): Promise<boolean> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log("📧 Email envoyé:", info.messageId);
    return true;
  }

  private getResetPasswordTemplate(data: ResetPasswordEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe - JobTracker</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f7f7f7; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #f97316, #dc2626); 
            color: white; 
            text-align: center; 
            padding: 30px 20px; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
            color: white; 
            padding: 14px 28px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            margin: 20px 0; 
            transition: all 0.3s ease; 
          }
          .button:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); 
          }
          .footer { 
            background-color: #f9fafb; 
            padding: 20px 30px; 
            text-align: center; 
            font-size: 14px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb; 
          }
          .warning { 
            background-color: #fef3c7; 
            border-left: 4px solid #f59e0b; 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 4px; 
          }
          .warning p { 
            margin: 0; 
            color: #92400e; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>JobTracker</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Réinitialisation de mot de passe</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Bonjour ${data.name} !</h2>
            
            <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte JobTracker.</p>
            
            <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetUrl}" class="button">
                🔐 Réinitialiser mon mot de passe
              </a>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Important :</strong> Ce lien est valide pendant 1 heure seulement.</p>
            </div>
            
            <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
            
            <p style="margin-top: 30px;">
              À bientôt sur JobTracker !<br>
              <em>L'équipe JobTracker</em>
            </p>
          </div>
          
          <div class="footer">
            <p>
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
              <a href="${data.resetUrl}" style="color: #3b82f6; word-break: break-all;">${data.resetUrl}</a>
            </p>
            <p style="margin-top: 15px;">
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendResetPasswordEmail(
    email: string,
    name: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = this.getResetPasswordTemplate({
      name,
      resetUrl,
    });

    return this.sendEmail({
      to: email,
      subject: "Réinitialisation de votre mot de passe JobTracker",
      html,
    });
  }

  async testConnection(): Promise<boolean> {
    return this.transporter.verify();
  }
}

export const emailService = new EmailService();
