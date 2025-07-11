import { google } from "googleapis";

export function initializeAuth(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken, token_type: "Bearer" });
  return auth;
}
