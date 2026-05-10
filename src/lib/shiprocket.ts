const SHIPROCKET_URL = "https://apiv2.shiprocket.in/v1/external";

type ShiprocketAuthResponse = {
  token?: string;
  message?: string;
};

// Token is valid for 240 hours (10 days) per Shiprocket API docs
// We cache for 9 days to refresh safely before expiry
let _cachedToken: string | null = null;
let _tokenExpiry = 0;

export const getShiprocketToken = async () => {
  if (_cachedToken && Date.now() < _tokenExpiry) return _cachedToken;

  const response = await fetch(`${SHIPROCKET_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_API_EMAIL,
      password: process.env.SHIPROCKET_API_PASSWORD,
    }),
  });

  const data = (await response.json()) as ShiprocketAuthResponse;
  
  if (!response.ok || !data.token) {
    console.error("[Shiprocket Auth] Failed:", data.message ?? "No token returned");
    return undefined;
  }

  _cachedToken = data.token;
  _tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days
  return _cachedToken;
};

export const createShiprocketOrder = async (orderData: Record<string, unknown>) => {
  const token = await getShiprocketToken();
  const response = await fetch(`${SHIPROCKET_URL}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  return await response.json();
};
