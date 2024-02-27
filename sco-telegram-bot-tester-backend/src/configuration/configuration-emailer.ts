import { registerAs } from "@nestjs/config";
export const configurationEmailer = registerAs("emailer", () => ({
  address: process.env.EMAIL_EMAILER,
  password: process.env.PASSWORD_EMAILER,
  service: process.env.SERVICE_EMAILER,
  subjectTitle: process.env.SUBJECT_TITLE_EMAILER,
}));