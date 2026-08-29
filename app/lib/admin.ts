import { env } from "cloudflare:workers";

export function isAdminEmail(email?: string | null) {
  const configured = (env as unknown as { ADMIN_EMAIL?: string }).ADMIN_EMAIL;
  return Boolean(configured && email && email.toLowerCase() === configured.toLowerCase());
}
