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

const isSmtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

export const sendInvitationEmail = async (
  email: string,
  organizationName: string,
  token: string
) => {
  if (!isSmtpConfigured()) {
    console.warn(
      `[mail] SMTP not configured, skipping invitation email to ${email}`
    );
    return;
  }

  const acceptUrl = `${process.env.CLIENT_URL}/invitations/accept?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: `You've been invited to join ${organizationName} on Orbit`,
    text: `You've been invited to join ${organizationName} on Orbit. Accept the invitation here: ${acceptUrl}`,
    html: `
      <div>
        <h2>You've been invited</h2>
        <p>You've been invited to join <strong>${organizationName}</strong> on Orbit.</p>
        <a href="${acceptUrl}">Accept invitation</a>
        <p>This invitation expires in 7 days.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  if (!isSmtpConfigured()) {
    console.warn(
      `[mail] SMTP not configured, skipping password reset email to ${email}`
    );
    return;
  }

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