import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_FROM,
    pass: env.EMAIL_PASS,
  },
});

export async function POST({ request }) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Všechna pole jsou povinná.' }), { status: 400 });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: env.EMAIL_TO,
      subject: `Nová zpráva z Timegate webu`,
      text: message,
      html: `<p><strong>Jméno:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Zpráva:</strong> ${message}</p>`,
    });

    return new Response(JSON.stringify({ message: 'Email byl úspěšně odeslán.' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Nepodařilo se odeslat email.' }), { status: 500 });
  }
}
