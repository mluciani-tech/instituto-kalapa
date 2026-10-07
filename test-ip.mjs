import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf-8');
const handleMatch = env.match(/INFINITEPAY_HANDLE=(.*)/);
const handle = handleMatch ? handleMatch[1].trim() : null;

async function run() {
  const payload = {
    handle: handle,
    items: [{ quantity: 1, price: 50, description: "Teste" }]
  };
  const res = await fetch("https://api.checkout.infinitepay.io/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  console.log("Price 50 cents:", res.status, await res.text());
  
  const payload2 = {
    handle: handle,
    items: [{ quantity: 1, price: 100, description: "Teste" }]
  };
  const res2 = await fetch("https://api.checkout.infinitepay.io/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload2)
  });
  console.log("Price 100 cents:", res2.status, await res2.text());
}
run();
