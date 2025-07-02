import axios from "axios";
 
export const KHALTI_CONFIG = {
  baseUrl: "https://a.khalti.com/api/v2",
  secretKey: "fb1f0db1d86944a5a929776725e5c5e2",
} as const;

export const khaltiClient = axios.create({
  baseURL: KHALTI_CONFIG.baseUrl,
  headers: {
    Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
    "Content-Type": "application/json",
  },
});