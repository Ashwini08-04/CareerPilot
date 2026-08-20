const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");

beforeAll(async () => {
    await connectDB();
});

describe("Auth API", () => {

    test("should register a new user", async () => {
        const uniqueEmail = `test${Date.now()}@example.com`;

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: uniqueEmail,
                password: "Test@123456"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.message).toBe(
            "User registered successfully"
        );
    });

    test("should login user successfully", async () => {
        const uniqueEmail = `login${Date.now()}@example.com`;
        const password = "Test@123456";

        // Register user first
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Login Test User",
                email: uniqueEmail,
                password
            });

        // Login
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: uniqueEmail,
                password
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.message).toBe(
            "Login successful"
        );

        expect(response.body.token).toBeDefined();
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});