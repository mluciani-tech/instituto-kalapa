require('dotenv').config({ path: '.env.local' });
async function run() {
  const payload = {
    handle: process.env.INFINITEPAY_HANDLE,
    items: [{ quantity: 1, price: 50, description: "Teste" }]
  };
  const res = await fetch("https://api.checkout.infinitepay.io/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  console.log(res.status, await res.text());
}
run();
