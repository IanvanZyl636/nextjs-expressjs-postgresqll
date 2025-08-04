import { ForgottenPasswordInput, MailTemplate } from "../types/nodemailer.types";

export const forgottenPasswordTemplate = (data: ForgottenPasswordInput): MailTemplate => ({
    subject: "Reset your password",
    html: `<p>Click <a href='${data.resetLink}'>here</a> to reset your password.</p>`,
});
