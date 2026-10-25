import { expect, test } from "bun:test";
import { POST } from "../app/api/contact/route";

const request = (payload, origin = "http://localhost:3107") =>
  new Request("http://localhost:3107/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      Host: "localhost:3107",
      "x-forwarded-for": crypto.randomUUID(),
    },
    body: JSON.stringify(payload),
  });

test("invalid JSON shapes return a validation response", async () => {
  for (const value of [null, [], "message", 123]) expect((await POST(request(value))).status).toBe(400);
});
test("reject cross-origin contact requests", async () => {
  expect((await POST(request({}, "https://example.invalid"))).status).toBe(403);
});
test("fast filling does not return false success", async () => {
  // Missing fields still fail validation even when autofill completes immediately.
  const response = await POST(request({ elapsed: 10 }));
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ ok: false });
});
