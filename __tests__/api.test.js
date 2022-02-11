"use strict";

const request = require("supertest");
const { DateTime } = require("luxon");

const { start } = require("../src/index");

describe("server", () => {
  let server;

  beforeAll(async () => {
    server = (await start()).server;
  });

  test("/api/health/", () =>
    request(server)
      .get("/api/health/")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty("version");
        expect(res.body).toHaveProperty("time");
        expect(res.body).toHaveProperty("status", "on");

        const time = DateTime.fromISO(res.body["time"]);
        expect(time.isValid).toBeTruthy();
      }));

  afterAll(() => server.close());
});
