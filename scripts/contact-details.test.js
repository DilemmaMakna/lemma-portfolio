import { expect, test } from "bun:test";
import { POST } from "../app/api/contact-details/route";

let ip = 0;
function request(body, extra = {}) {
  return new Request("http://localhost/api/contact-details", {
    method: "POST",
    headers: {
      host: "localhost",
      origin: "http://localhost",
      "content-type": "application/json",
      "x-forwarded-for": `test-${++ip}`,
      ...extra,
    },
    body: JSON.stringify(body),
  });
}
test("contact details require same-origin JSON POST requests", async () => {
  expect((await POST(request({ channel: "email" }, { origin: "https://other.example" }))).status).toBe(403);
  expect((await POST(request({ channel: "email" }, { origin: "" }))).status).toBe(403);
  expect((await POST(request({ channel: "email" }, { "content-type": "text/plain" }))).status).toBe(415);
});
test("invalid channels never return a contact", async () => {
  for (const body of [null, [], { channel: "__proto__" }, { channel: "missing" }]) {
    expect((await POST(request(body))).status).toBe(400);
  }
});
test("revealed contacts cannot be cached", async () => {
  const response = await POST(request({ channel: "email" }));
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toContain("no-store");
  expect(response.headers.get("x-robots-tag")).toContain("noindex");
  expect((await response.json()).href).toStartWith("mailto:");
});
test("contact harvesting is rate limited per IP", async () => {
  for (let i = 0; i < 12; i++)
    expect((await POST(request({ channel: "nataku" }, { "x-forwarded-for": "rate-test" }))).status).toBe(200);
  expect((await POST(request({ channel: "nataku" }, { "x-forwarded-for": "rate-test" }))).status).toBe(429);
});
