import { Resend } from 'resend';

console.log("✅ File sendEmail.js loaded");

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, otp) {
  console.log("📧 [SEND] Gửi email đến:", to);
  console.log(
    "RESEND_API_KEY:",
    process.env.RESEND_API_KEY ? "✅ Loaded" : "❌ Missing"
  );

  const subject = "Mã xác minh đăng ký tài khoản";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #41563F; margin-bottom: 20px;">Xác minh tài khoản của bạn</h2>
        <p style="color: #333; line-height: 1.6;">Chào bạn,</p>
        <p style="color: #333; line-height: 1.6;">
          Bạn đã yêu cầu xác minh email <strong>${to}</strong> vào lúc ${new Date().toLocaleString("vi-VN")}.
        </p>
        <p style="color: #333; line-height: 1.6;">
          Để hoàn tất đăng ký, vui lòng nhập mã xác minh bên dưới:
        </p>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #41563F; letter-spacing: 5px;">${otp}</span>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          ⏱️ Mã này sẽ hết hạn sau <strong>10 phút</strong> kể từ khi email này được gửi.
        </p>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Email này được gửi tự động, vui lòng không trả lời.<br>
          © Quiz Company - Project Quizzes
        </p>
      </div>
    </div>
  `;

  const textContent = `Chào bạn,

Bạn đã yêu cầu xác minh email ${to} trên ${new Date().toLocaleString("vi-VN")}.
Để tiếp tục, vui lòng nhập mã bên dưới vào trang web đăng ký:

${otp}

Mã này sẽ hết hạn sau 10 phút kể từ khi email này được gửi.
Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.

Email này được gửi tự động, vui lòng không trả lời.

Trân trọng,
Quiz Company`;

  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY không được cấu hình. OTP sẽ được hiển thị trong console:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📧 Email: ${to}`);
      console.log(`🔐 OTP: ${otp}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return { success: true, mode: 'console' };
    }

    const data = await resend.emails.send({
      from: 'Quiz Company <noreply@quiz.id.vn>',
      to: [to],
      subject: subject,
      html: htmlContent,
      text: textContent,
    });

    if (data.error) {
      console.error("❌ Resend API Error:", data.error);
      console.log("⚠️ Fallback: Hiển thị OTP trong console (Domain chưa được verify hoặc email testing)");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📧 Email: ${to}`);
      console.log(`🔐 OTP: ${otp}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return { success: true, mode: 'console_fallback', error: data.error };
    }

    console.log("✅ Email đã gửi đến:", to);
    console.log("📨 Response:", data);
    return { success: true, mode: 'email', data };
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    console.log("⚠️ Fallback: Hiển thị OTP trong console");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📧 Email: ${to}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return { success: true, mode: 'console_exception', error: error.message };
  }
}
export default sendVerificationEmail;
