import {SendMailOptions} from "nodemailer";
import { MailTemplateType } from "../constants/mail-template.constants";

export type MailTemplate = Pick<SendMailOptions, 'html' | 'subject'>;


export interface ForgottenPasswordInput {
  resetLink: string
}

export interface VerifyEmailInput {
  verificationLink: string
}

export type Email =
  | { emailType: MailTemplateType.FORGOTTEN_PASSWORD; data: ForgottenPasswordInput }
  | { emailType: MailTemplateType.EMAIL_VERIFICATION; data: VerifyEmailInput };