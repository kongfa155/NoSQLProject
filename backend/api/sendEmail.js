// backend/api/sendEmail.js (ESM style)
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, otp) {
  const subject = "Mã xác minh đăng ký tài khoản";

  const text = `Chào bạn,

Bạn đã yêu cầu xác minh email ${to} trên ${new Date().toLocaleString("vi-VN")}.
Để tiếp tục, vui lòng nhập mã bên dưới vào trang web đăng ký:

${otp}

Mã này sẽ hết hạn sau 10 phút kể từ khi email này được gửi.
Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ với bộ phận chăm sóc khách hàng để được hỗ trợ.

Email này được gửi tự động, vui lòng không trả lời.

Trân trọng,
Quiz Company`;

  try {
    const response = await resend.emails.send({
      from: "Quiz Company <onboarding@resend.dev>", // hoặc domain verified
      to,
      subject,
      text,
    });

    console.log("✅ Email đã gửi đến:", to);
    return response;
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    throw new Error("Gửi email thất bại");
  }
}
