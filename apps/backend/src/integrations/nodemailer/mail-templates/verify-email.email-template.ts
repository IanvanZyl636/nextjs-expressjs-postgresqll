import { MailTemplate, VerifyEmailInput } from "../types/nodemailer.types";

export const verifyEmailTemplate = (data: VerifyEmailInput): MailTemplate => ({
    subject: "Verify your email",
    html: `<p>Click <a href='${data.verificationLink}'>here</a> to verify your email.</p>`,
});
