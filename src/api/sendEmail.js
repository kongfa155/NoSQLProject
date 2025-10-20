//src/api sendEmail.js (ESM style)
import nodemailer from "nodemailer";

export async function sendVerificationEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Quiz Company" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Mã xác minh đăng ký tài khoản",
    text: `Chào bạn,

Bạn đã yêu cầu xác minh email ${to} trên ${new Date().toLocaleString("vi-VN")}.
Để tiếp tục, vui lòng nhập mã bên dưới vào trang web đăng ký:

${otp}

Mã này sẽ hết hạn sau 10 phút kể từ khi email này được gửi.
Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ với bộ phận chăm sóc khách hàng để được hỗ trợ.

Email này được gửi tự động, vui lòng không trả lời.

Trân trọng,
Quiz Company`,
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ Email đã gửi đến:", to);
}
