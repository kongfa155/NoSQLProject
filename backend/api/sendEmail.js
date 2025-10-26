import sgMail from "@sendgrid/mail";
console.log("✅ File sendEmail.js loaded");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export async function sendVerificationEmail(to, otp) {
    console.log("📧 [SEND] Gửi email đến:", to);
    console.log(
      "SENDGRID_API_KEY:",
      process.env.SENDGRID_API_KEY ? "✅ Loaded" : "❌ Missing"
    );
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

  const msg = {
    from: "Quiz Company <nguyenhuynhngocquyen1@gmail.com>", // domain/email đã verify
    to,
    subject,
    text,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("✅ Email đã gửi đến:", to);
    return response;
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    throw new Error("Gửi email thất bại");
  }
}
