import { config } from "dotenv";
import nodemailer from "nodemailer";
import logger from "../logging";

config();

const emailSender = {
  email: process.env.EMAIL_SENDER,
  password: process.env.EMAIL_SENDER_PASSWORD,
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "login",
    user: emailSender.email || "",
    pass: emailSender.password || "",
  },
});

type EmailNotificationParams = {
  to: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
};

export const sendEmailNotification = async ({
  to,
  subject,
  htmlContent = "",
  textContent = "",
  attachments = [],
}: EmailNotificationParams): Promise<void> => {
  const mailOptions = {
    from: emailSender.email,
    to,
    subject,
    text: textContent,
    html: htmlContent,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to} with subject: ${subject}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}`);
    logger.error(error);
  }
};
