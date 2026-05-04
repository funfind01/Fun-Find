const email = process.env.SHIPROCKET_API_EMAIL;
const password = process.env.SHIPROCKET_API_PASSWORD;

async function run() {
  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log("Login Res:", data);
  } catch(e) {
    console.error(e);
  }
}
run();
