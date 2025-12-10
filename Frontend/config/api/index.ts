import { AUTH_ENDPOINTS } from "./auth";
import { SUMMARY_ENDPOINTS } from "./summary";
import { TRANSACTION_ENDPOINTS } from "./transaction";
import { CATEGORY_ENDPOINTS } from "./category";
import { ACCOUNTS_ENDPOINTS } from "./accounts";
import { USER_ENDPOINTS } from "./user";
import { SECURITY_QUESTIONS_ENDPOINTS } from "./securityQuestions";
import { CURRENCY_ENDPOINTS } from "./currency";
import { ROLES_ENDPOINTS } from "./roles";
import { SAVINGS_GOALS_ENDPOINTS } from "./savingsGoals";
import { TAG_GROUPS_ENDPOINTS } from "./tagGroups";
import { TAGS_ENDPOINTS } from "./tags";

export const API_ENDPOINTS = {
  auth: AUTH_ENDPOINTS,
  summary: SUMMARY_ENDPOINTS,
  transaction: TRANSACTION_ENDPOINTS,
  category: CATEGORY_ENDPOINTS,
  accounts: ACCOUNTS_ENDPOINTS,
  user: USER_ENDPOINTS,
  securityQuestions: SECURITY_QUESTIONS_ENDPOINTS,
  currency: CURRENCY_ENDPOINTS,
  roles: ROLES_ENDPOINTS,
  savingsGoals: SAVINGS_GOALS_ENDPOINTS,
  tags: TAGS_ENDPOINTS,
  tagGroups: TAG_GROUPS_ENDPOINTS,
};
