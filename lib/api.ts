import { cookies } from "./cookie-manager";

export async function saveAuth(data: any) {
  cookies.saveTokens(data);
}
