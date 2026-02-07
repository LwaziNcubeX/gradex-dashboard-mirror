import { cookies } from "./cookie-manager";

export async function saveAuth(data: any) {
  await cookies.saveTokens(data);
}
