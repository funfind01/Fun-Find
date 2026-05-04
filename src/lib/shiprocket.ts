const SHIPROCKET_URL = "https://apiv2.shiprocket.in/v1/external";

export const getShiprocketToken = async () => {
  const response = await fetch(`${SHIPROCKET_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_API_EMAIL,
      password: process.env.SHIPROCKET_API_PASSWORD,
    }),
  });

  const data = await response.json();
  return data.token;
};

export const createShiprocketOrder = async (orderData: any) => {
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
