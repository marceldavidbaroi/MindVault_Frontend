export const SECURITY_QUESTIONS_ENDPOINTS = {
  get: "/security-questions",
  create: "/security-questions",
  update: (id: number | string) => `/security-questions/${id}`,
  delete: (id: number | string) => `/security-questions/${id}`,
};
