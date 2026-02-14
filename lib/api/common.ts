import { cookies } from "../cookie-manager";

export const API_URL = "http://localhost:8000/admin";

const accessToken = cookies.getAccessToken();

export const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};
