// استدعاء الصيغة الصحيحة
const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

/**
 * إرسال رسالة WhatsApp عبر Vonage
 * @param {string} phone رقم الهاتف بصيغة دولية +201XXXXXXXXX
 * @param {string} message نص الرسالة
 */
exports.sendWhatsAppMessage = async (phone, message) => {
  try {
    const response = await vonage.sms.send({
      to: phone.replace("+", ""), // بدون +
      from: process.env.VONAGE_WHATSAPP_NUMBER.replace("whatsapp:", ""), 
      text: message
    });
    return response;
  } catch (err) {
    throw err;
  }
};
