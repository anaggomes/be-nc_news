const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpointsFile = require("../endpoints.json");

afterAll(() => {
  return db.end();
});
beforeEach(() => {
  return seed(data);
});

describe("/api/topics", () => {
  test("GET 200: Responds with an array with all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("* Endpoints", () => {
  test("* 404: Responds with an error when provided path does not exist", () => {
    return request(app)
      .get("/api/topicsss")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Path Not Found");
      });
  });
});

describe("/api", () => {
  test("GET 200: Responds with a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toMatchObject(endpointsFile);
      });
  });
});
