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
        expect(topics).toHaveLength(3);
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

describe("/api/articles/:article_id", () => {
  test("GET 200: Responds with the article with the correspondent id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("GET 400: Responds with an error when requested id is of incorrect datatype", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 404: Responds with an error when requested id does not exist in the database", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("PATCH 200: Increases the number of votes for the corresponding article, when requestBody has votes property >0. Responds with the updated article.", () => {
    const requestBody = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 105,
          article_img_url: expect.any(String),
        });
      });
  });
  test("PATCH 200: Decreases the number of votes for the corresponding article, when requestBody has votes property < 0. Responds with the updated article.", () => {
    const requestBody = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(requestBody)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: -10,
          article_img_url: expect.any(String),
        });
      });
  });
  test("PATCH 404: Responds with an error when article_id is does not exist in the database", () => {
    const requestBody = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/15")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("PATCH 400: Responds with an error when article_id is is of incorrect datatype", () => {
    const requestBody = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/fifteen")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("PATCH 400: Responds with an error when requestBody votes property is is of incorrect datatype", () => {
    const requestBody = {
      inc_votes: "five",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("PATCH 400: Responds with an error when requestBody does not have the correct property name", () => {
    const requestBody = {
      add_votes: 5,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: Responds with an array with all the articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 200:Responds, by default, with an array of all articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200:Responds with an array with all the articles without the body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: Responds with an array with all the comments for the corresponding article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 5,
          });
        });
      });
  });
  test("GET 200: Responds with an array with the comments for the corresponding article_id, sorted by date, in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: Responds with an empty array if article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(0);
      });
  });
  test("GET 404: Responds with an error when requested article_id does not exist in the database", () => {
    return request(app)
      .get("/api/articles/15/comments")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("GET 400: Responds with an error when requested article_id is of incorrect datatype", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("POST 201: Responds with the comment added to the corresponding article", () => {
    const requestBody = {
      username: "rogersop",
      body: "Text from the comment..",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          author: "rogersop",
          body: "Text from the comment..",
          article_id: 2,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("POST 400: Responds with an error if the article_id does not exist in the database", () => {
    const requestBody = {
      username: "rogersop",
      body: "Text from the comment..",
    };
    return request(app)
      .post("/api/articles/15/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("POST 400: Responds with an error if the username does not exist in the database", () => {
    const requestBody = {
      username: "anyothername",
      body: "Text from the comment..",
    };
    return request(app)
      .post("/api/articles/15/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("POST 400: Responds with an error when requested article_id is of incorrect datatype", () => {
    const requestBody = {
      name: "rogersop",
      body: "Text from the comment..",
    };
    return request(app)
      .post("/api/articles/fifteen/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("POST 400: Responds with an error if the posted comment does not have the correct property names", () => {
    const requestBody = {
      name: "rogersop",
      body: "Text from the comment..",
    };
    return request(app)
      .post("/api/articles/15/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("POST 400: Responds with an error if the posted comment does not have all properties required", () => {
    const requestBody = {
      name: "rogersop",
    };
    return request(app)
      .post("/api/articles/15/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("POST 400: Responds with an error if the posted comment properties are not of the correct type", () => {
    const requestBody = {
      name: "rogersop",
      body: 999,
    };
    return request(app)
      .post("/api/articles/15/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: Deletes the corresponding comment_id", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE 404: Responds with an error when comment_id does not exist in the database", () => {
    return request(app)
      .delete("/api/comments/200")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("DELETE 404: Responds with an error when comment_id is of invalid datatype", () => {
    return request(app)
      .delete("/api/comments/two")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
});
