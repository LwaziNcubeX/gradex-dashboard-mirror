import { cookies } from "../cookie-manager";

export const API_URL = "http://localhost:8000/admin";

export const accessToken = cookies.getAccessToken();
