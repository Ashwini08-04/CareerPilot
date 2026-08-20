const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");

let token;

beforeAll(async () => {
    await connectDB();

    const email = `jobtest${Date.now()}@example.com`;
    const password = "Test@123456";

    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Job Test User",
            email,
            password
        });

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password
        });

    token = loginResponse.body.token;
});

describe("Job API", () => {

    test("should create a new job", async () => {
        const response = await request(app)
            .post("/api/jobs")
            .set("Authorization", `Bearer ${token}`)
            .send({
                company: "Google",
                jobTitle: "Full Stack Developer",
                jobUrl: "https://example.com/job",
                location: "Hyderabad",
                salary: "₹10 LPA",
                status: "Wishlist",
                notes: "Prepare for MERN stack interview"
            });

        expect(response.statusCode).toBe(201);
    });

    test("should get all jobs", async () => {
        const response = await request(app)
            .get("/api/jobs")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
    });

    test("should reject request without authentication", async () => {
        const response = await request(app)
            .get("/api/jobs");

        expect(response.statusCode).toBe(401);
    });

});

afterAll(async () => {
    await mongoose.connection.close();
});