import nodemailer from "nodemailer";

import { logger } from "./serviceLogging";
import { getApiConfig } from "../config";

// TODO: maybe use https://www.npmjs.com/package/email-templates

const apiConfig = getApiConfig();

const transport = nodemailer.createTransport({
  host: apiConfig.smtp.host,
  port: apiConfig.smtp.port,
  secure: apiConfig.smtp.secure, // true for 465, false for other ports
  auth: {
    user: apiConfig.smtp.user, // generated ethereal user
    pass: apiConfig.smtp.password, // generated ethereal password
  },
});

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

export const sendEmail = (to: string, subject: string, text: string) => {
  const msg = { from: apiConfig.email.from, to, subject, text };

  logger.info(`[service.email.sendMail]: ${subject}`);

  return transport.sendMail(msg).catch((error) => {
    logger.error(error);
  });
};

export const sendEmailConfirmationEmail = async (to: string, token: string) => {
  const subject = `${apiConfig.email.subjectPrefix} Please verify your email`;

  // replace this url with the link to the reset password page of your front-end app
  const verificationEmailUrl = `${apiConfig.baseUrl.dapp}/email-confirmation/?token=${token}`;

  const text = `Dear user,

To verify your email, click on this link: ${verificationEmailUrl}
If you did not create a new account with us or just changed your email address, then please ignore this email.

Thank you your, 
${apiConfig.appName} team`;

  await sendEmail(to, subject, text);
};

export default {
  transport,
  sendEmail,
  sendEmailConfirmationEmail,
};
