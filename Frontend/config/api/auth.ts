export const AUTH_ENDPOINTS = {
  signin: "/auth/signin",
  signup: "/auth/signup",
  logout: "/auth/logout",
  me: "/auth/me",
  getPasskey: "/auth/passkey",
  resetPasswordPasskey: "/auth/passkey/reset",
  changePassword: "/auth/passkey/change",
  getQuestions: (username: string) =>
    `/auth/forgot-password/${username}/questions`,
  answerVerify: (username: string) =>
    `/auth/forgot-password/${username}/verify`,
};
