// Since we're using local storage for now, we'll simulate email functionality
export const sendEmail = async (to: string, subject: string, content: string) => {
  console.log('Email would be sent:', { to, subject, content });
  return Promise.resolve({ success: true });
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
  const content = `
    <h1>Password Reset Request</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  
  return sendEmail(email, 'Password Reset Request', content);
};

export const sendWelcomeEmail = async (email: string, temporaryPassword: string) => {
  const content = `
    <h1>Welcome to CCSBA!</h1>
    <p>Your account has been created with the following credentials:</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
    <p>Please log in and change your password immediately.</p>
  `;
  
  return sendEmail(email, 'Welcome to CCSBA', content);
};