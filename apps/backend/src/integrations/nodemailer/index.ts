import nodemailer from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { Email } from './types/nodemailer.types';
import { MailTemplateType } from './constants/mail-template.constants';
import { forgottenPasswordTemplate } from './mail-templates/forgotten-password.email-template';
import { verifyEmailTemplate } from './mail-templates/verify-email.email-template';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
} as SMTPConnection.Options);

const mailOptions = {
    from: process.env.SMTP_EMAIL_FROM,
    to: process.env.SMTP_EMAIL_TO,
};

export const sendEmail = async (email: Email) => {
    let options = { ...mailOptions };

    switch (email.emailType) {
        case MailTemplateType.FORGOTTEN_PASSWORD:
            options = { ...options, ...forgottenPasswordTemplate(email.data) }
            break;
        case MailTemplateType.EMAIL_VERIFICATION:
            options = { ...options, ...verifyEmailTemplate(email.data) }
            break;
        default:
            throw new Error('Unknown email type');
    }

    await transporter.sendMail(options);
}