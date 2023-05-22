import { NextApiRequest, NextApiResponse } from "next";
import { transporter } from "../../config/nodemailer";

const sendRecoveryEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, recoveryCode } = req.body;

    if (!email) {
      return res.status(400).json({ message: "E-mail is required" });
    }

    try {
      // Configurar o e-mail de recuperação de senha
      const mailOptions = {
        from: "cristianoteste@example.com", // E-mail do remetente
        to: email, // E-mail do destinatário (usuário que solicitou a recuperação)
        subject: "Recuperação de Senha", // Assunto do e-mail
        text: `Olá! Aqui está o seu código de recuperação de senha: ${recoveryCode}`, // Corpo do e-mail com o código de recuperação
      };

      // Enviar o e-mail usando o transporter do nodemailer
      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: "E-mail sent successfully" });
    } catch (error: any) {
      console.error("Error sending recovery email:", error);
      return res.status(500).json({ message: "Error sending recovery email" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
};

export default sendRecoveryEmail;
