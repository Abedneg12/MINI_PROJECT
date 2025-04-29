import nodemailer from 'nodemailer';
import hbs from 'handlebars';
import fs from 'fs';
import path from 'path';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

export const sendVerificationEmail = async (
  to: string,
  name: string,
  token: string
) => {
  const templatePath = path.join(__dirname, '../templates/verify-email.hbs');
  const source = fs.readFileSync(templatePath, 'utf8');
  const template = hbs.compile(source);

  const html = template({
    name,
    verifyUrl: `${process.env.BASE_URL}/verify-email?token=${token}`,
  });

  await transporter.sendMail({
    from: `"FindYourTicket" <${process.env.NODEMAILER_EMAIL}>`,
    to,
    subject: 'Verifikasi Akun Anda',
    html,
  });
};
