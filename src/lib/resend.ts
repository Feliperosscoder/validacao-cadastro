import { Resend } from "resend";
require('dotenv').config();

export const resend = new Resend(process.env.RESEND_KEY);
