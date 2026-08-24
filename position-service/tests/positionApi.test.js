const request = require("supertest");

const app = require("../src/index");

describe("Position API", () => {

  test("GET /position should return current positions", async () => {
    const response = await request(app)
      .get("/position");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });

});
