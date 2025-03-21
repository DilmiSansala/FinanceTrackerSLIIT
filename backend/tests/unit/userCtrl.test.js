const request = require("supertest");
const app = require("../../app");
const User = require("../../model/User");
const mongoose = require("mongoose");
//npm test( only unit test)
//npm run test:all(if all)


describe("User Controller", () => {
    // Clear the database before each test
    beforeEach(async () => {
        await User.deleteMany({});
    });

    // Close the database connection after all tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Test user registration
    describe("POST /api/v1/users/register", () => {
        it("should register a new user", async () => {
            const res = await request(app)
                .post("/api/v1/users/register")
                .send({ username: "dilmi", email: "dilmi@gmail.com", password: "123456" });

            expect(res.statusCode).toEqual(201); // Expect 201 for successful creation
            expect(res.body).toHaveProperty("username", "dilmi");
            expect(res.body).toHaveProperty("email", "dilmi@gmail.com");
        });

        it("should not register a user with missing fields", async () => {
            const res = await request(app)
                .post("/api/v1/users/register")
                .send({ username: "dilmi" }); // Missing email and password

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("message", "Please all fields are required");
        });

        it("should not register a user with an existing email", async () => {
            // Register a user first
            await request(app)
                .post("/api/v1/users/register")
                .send({ username: "dilmi", email: "dilmi@gmail.com", password: "123456" });

            // Try to register the same user again
            const res = await request(app)
                .post("/api/v1/users/register")
                .send({ username: "dilmi2", email: "dilmi@gmail.com", password: "123456" });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("message", "User already exists");
        });
    });

    // Test user login
    describe("POST /api/v1/users/login", () => {
        it("should login an existing user", async () => {
            // Register a user first
            await request(app)
                .post("/api/v1/users/register")
                .send({ username: "dilmi", email: "dilmi@gmail.com", password: "123456" });

            // Login with the registered user
            const res = await request(app)
                .post("/api/v1/users/login")
                .send({ email: "dilmi@gmail.com", password: "123456" });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("token");
        });

        it("should not login with invalid credentials", async () => {
            // Register a user first
            await request(app)
                .post("/api/v1/users/register")
                .send({ username: "dilmi", email: "dilmi@gmail.com", password: "123456" });

            // Try to login with wrong password
            const res = await request(app)
                .post("/api/v1/users/login")
                .send({ email: "dilmi@gmail.com", password: "wrongpassword" });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("message", "Invalid login credentials");
        });
    });

    // Test user profile
    describe("GET /api/v1/users/profile", () => {
        it("should fetch the user profile", async () => {
            // Register a user first
            const registerRes = await request(app)
                .post("/api/v1/users/register")
                .send({ username: "dilmi", email: "dilmi@gmail.com", password: "123456" });

            // Login to get the token
            const loginRes = await request(app)
                .post("/api/v1/users/login")
                .send({ email: "dilmi@gmail.com", password: "123456" });

            const token = loginRes.body.token;

            // Fetch the profile using the token
            const profileRes = await request(app)
                .get("/api/v1/users/profile")
                .set("Authorization", `Bearer ${token}`);

            expect(profileRes.statusCode).toEqual(200);
            expect(profileRes.body).toHaveProperty("username", "dilmi");
            expect(profileRes.body).toHaveProperty("email", "dilmi@gmail.com");
        });

        it("should not fetch the profile of a non-existent user", async () => {
            // Try to fetch the profile without a valid token
            const res = await request(app)
                .get("/api/v1/users/profile")
                .set("Authorization", "Bearer invalidtoken");

            expect(res.statusCode).toEqual(401);
        });
    });

    // Test change password
    describe("PUT /api/v1/users/change-password", () => {
        it("should change the user password", async () => {
            // Register a user first
            const registerRes = await request(app)
                .post("/api/v1/users/register")
                .send({ username: "dilmi", email: "dilmi@gmail.com", password: "123456" });

            // Login to get the token
            const loginRes = await request(app)
                .post("/api/v1/users/login")
                .send({ email: "dilmi@gmail.com", password: "123456" });

            const token = loginRes.body.token;

            // Change the password
            const changePasswordRes = await request(app)
                .put("/api/v1/users/change-password")
                .set("Authorization", `Bearer ${token}`)
                .send({ newPassword: "newpassword123" });

            expect(changePasswordRes.statusCode).toEqual(200);
            expect(changePasswordRes.body).toHaveProperty("message", "Password Changed successfully");
        });
    });

    // Test update profile
    describe("PUT /api/v1/users/update-profile", () => {
        it("should update the user profile", async () => {
            // Register a user first
            const registerRes = await request(app)
                .post("/api/v1/users/register")
                .send({ username: "dilmi", email: "dilmi@gmail.com", password: "123456" });

            // Login to get the token
            const loginRes = await request(app)
                .post("/api/v1/users/login")
                .send({ email: "dilmi@gmail.com", password: "123456" });

            const token = loginRes.body.token;

            // Update the profile
            const updateProfileRes = await request(app)
                .put("/api/v1/users/update-profile")
                .set("Authorization", `Bearer ${token}`)
                .send({ username: "dilmiupdated", email: "dilmiupdated@gmail.com" });

            expect(updateProfileRes.statusCode).toEqual(200);
            expect(updateProfileRes.body).toHaveProperty("message", "User profile updated successfully");
            expect(updateProfileRes.body.updatedUser.username).toEqual("dilmiupdated");
        });
    });
});