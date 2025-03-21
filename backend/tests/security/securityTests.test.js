const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken");


describe("Security Tests - Input Validation", () => {
  test("POST /api/v1/users/login - should reject NoSQL injection", async () => {
    const response = await request(app)
      .post("/api/v1/users/login")
      .send({
        email: { $ne: null }, // NoSQL injection attempt
        password: { $ne: null },
      });

    expect(response.status).toBe(401); // Should reject with a 400 Bad Request
  });

  test("GET /api/v1/users/profile - should reject expired token", async () => {
    const expiredToken = jwt.sign({ id: "mockUserId" }, process.env.JWT_SECRET, {
      expiresIn: "0s", // Expired token
    });

    const response = await request(app)
      .get("/api/v1/users/profile")
      .set("Authorization",` Bearer ${expiredToken}`);

    expect(response.status).toBe(401); // Should reject with a 401 Unauthorized
  });
});