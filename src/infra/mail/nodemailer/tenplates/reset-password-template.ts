interface verifyEmailTemplateRequest {
  name: string
  subject: string
  code: string
}

export function resetPasswordTemplate({
  name,
  subject,
  code,
}: verifyEmailTemplateRequest): string {
  const link = `${process.env.APP_URL}/reset-password/${code}`

  return `
  <div style="background-color: #f5f5f5; padding: 20px;">
  <h1 style="color: #333; font-size: 24px; font-weight: 600;">${subject}</h1>
  <p style="color: #333; font-size: 16px;">Olá ${name},</p>
  </div>
  <hr>
  <p style="color: #333; font-size: 16px;">Clique <a href="${link}">aqui</a> para redefinir sua senha.</p>
  <p style="color: #333; font-size: 16px;">Se você não solicitou essa redefinição, por favor, ignore este e-mail.</p>
  <p style="color: #333; font-size: 16px;">Este é um e-mail automático, por favor, não responda.</p>
  <p style="color: #333; font-size: 16px;">Obrigado por usar nossos serviços!</p>
  <p style="color: #333; font-size: 16px;">Se você tiver alguma dúvida, entre em contato conosco.</p>
  <p style="color: #333; font-size: 16px;">Atenciosamente,</p>
  <p style="color: #333; font-size: 16px;">Equipe Finance</p>
  `
}
