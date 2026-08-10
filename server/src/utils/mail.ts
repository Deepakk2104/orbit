import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const resetUrl =
    `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Reset your Orbit password",
    text: `Reset your Orbit password here: ${resetUrl}`,
    html: `
      <div>
        <h2>Reset your Orbit password</h2>
        <p>Click the link below to create a new password.</p>
        <a href="${resetUrl}">Reset password</a>
        <p>This link expires in 15 minutes.</p>
      </div>
    `,
  });
};