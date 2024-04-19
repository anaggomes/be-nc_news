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
  test("POST 201: Responds with the new added topic ", () => {
    const requestBody = {
      slug: "topic name here",
      description: "description here",
    };
    return request(app)
      .post("/api/topics")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic).toMatchObject({
          slug: "topic name here",
          description: "description here",
        });
      });
  });
  test("POST 201: Responds with the new added topic if no description is given", () => {
    const requestBody = {
      slug: "topic name here",
    };
    return request(app)
      .post("/api/topics")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic).toMatchObject({
          slug: "topic name here",
        });
      });
  });

  test("POST 400: Responds with an error if the posted topic does not have the correct property names", () => {
    const requestBody = {
      name: "topic name here",
      description: "description here",
    };
    return request(app)
      .post("/api/topics")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("POST 400: Responds with an error if the posted article does not have all properties required", () => {
    const requestBody = {
      description: "description here",
    };
    return request(app)
      .post("/api/topics")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
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
  test("GET 200: The article returned has property of comment_count", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("comment_count", expect.any(Number));
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
  test("DELETE 204: Deletes the article_id and the corresponding comments", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("DELETE 404: Responds with an error when article_id does not exist in the database", () => {
    return request(app)
      .delete("/api/articles/200")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("DELETE 404: Responds with an error when article_id is of invalid datatype", () => {
    return request(app)
      .delete("/api/articles/two")
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
        const { articles, total_count } = body;

        expect(total_count).toBe("13");
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
        const { articles, total_count } = body;

        expect(total_count).toBe("13");
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("GET 200: Responds with an array of the articles filtered by the query value", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles, total_count } = body;

        expect(total_count).toBe("12");
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET 200: Responds with an empty array if the query value is valid but there are no results in the database", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles, total_count } = body;
        expect(total_count).toBe("0");
      });
  });
  test("GET 200: Responds, by default, with an array of the articles sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: Responds with an array of the articles sorted by a valid column name in the default order", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("GET 200: Responds with an array of the articles in ascending order, sorted by created_at by default", () => {
    return request(app)
      .get("/api/articles?order_by=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("GET 200: Responds with an array of the articles sorted by a valid column name in ascending order.", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order_by=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("topic");
      });
  });
  test("GET 200: Responds with an array of the articles filtered by the query value and sorted by a valid column name.", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
        expect(articles).toBeSortedBy("topic");
      });
  });
  test("GET 404: Responds with an error if query value does not exist in the database", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("GET 400: Responds with an error if query refers to a column that is not valid/does not exist", () => {
    return request(app)
      .get("/api/articles?subject=cats")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 400: Responds with an error if sort_by query refers to a column name that does not exist", () => {
    return request(app)
      .get("/api/articles?sort_by=subject")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 400: Responds with an error if order_by query refers to a value that is not valid", () => {
    return request(app)
      .get("/api/articles?order_by=highest")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 400: Responds with an error if any of the query values is not valid", () => {
    return request(app)
      .get("/api/articles?order_by=highest&sort_by=author")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 400: Responds with an error if the query names are not valid", () => {
    return request(app)
      .get("/api/articles?ordered=asc&sorted=topic")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("POST 201: Responds with the added article with the default url ", () => {
    const requestBody = {
      author: "icellusedkars",
      title: "Text from title...",
      body: "Text from body...",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: "Text from title...",
          topic: "cats",
          author: "icellusedkars",
          body: "Text from body...",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          comment_count: expect.any(Number),
        });
      });
  });
  test("POST 201: Responds with the added article with the provided url", () => {
    const requestBody = {
      author: "icellusedkars",
      title: "Text from title...",
      body: "Text from body...",
      topic: "cats",
      article_img_url: "url",
    };
    return request(app)
      .post("/api/articles")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_img_url", "url");
      });
  });
  test("POST 404: Responds with an error if the author does not exist in the database", () => {
    const requestBody = {
      author: "anyName",
      title: "Text from title...",
      body: "Text from body...",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("POST 404: Responds with an error if the topic does not exist in the database", () => {
    const requestBody = {
      author: "icellusedkars",
      title: "Text from title...",
      body: "Text from body...",
      topic: "dogs",
    };
    return request(app)
      .post("/api/articles")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("POST 400: Responds with an error if the posted article does not have the correct property names", () => {
    const requestBody = {
      author: "icellusedkars",
      title: "Text from title...",
      comment: "Text from body...",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("POST 400: Responds with an error if the posted article does not have all properties required", () => {
    const requestBody = {
      author: "icellusedkars",
      title: "Text from title...",
      body: "Text from body...",
    };
    return request(app)
      .post("/api/articles")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 200: Responds with the first page of articles, default to 10 results, and the total number of articles", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles, total_count } = body;

        expect(total_count).toBe("12");
        expect(articles).toHaveLength(10);
      });
  });
  test("GET 200: Responds with the first page of articles containing the number of articles passed in the query", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body }) => {
        const { articles, total_count } = body;
        expect(total_count).toBe("13");
        expect(articles).toHaveLength(5);
      });
  });
  test("GET 200: Responds with the second page of articles when passed the page number", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order_by=asc&p=2")
      .expect(200)
      .then(({ body }) => {
        const { articles, total_count } = body;
        expect(total_count).toBe("13");
        expect(articles).toHaveLength(3);
        expect(articles[0]).toHaveProperty("article_id", 11);
      });
  });
  test("GET 200: Responds with the requested page of articles when passed a page number and a limit number", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order_by=asc&p=2&limit=5")
      .expect(200)
      .then(({ body }) => {
        const { articles, total_count } = body;
        expect(total_count).toBe("13");
        expect(articles).toHaveLength(5);
        expect(articles[0]).toHaveProperty("article_id", 6);
      });
  });
  test("GET 200: Responds with the all the articles when limit number is higher than the number or articles for thar request", () => {
    return request(app)
      .get("/api/articles?limit=20")
      .expect(200)
      .then(({ body }) => {
        const { articles, total_count } = body;

        expect(total_count).toBe("13");
        expect(articles).toHaveLength(13);
      });
  });
  test("GET 404: Responds with an error when the requested page of articles does not have any results", () => {
    return request(app)
      .get("/api/articles?p=3")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("GET 400: Responds with an error when the request is incomplete", () => {
    return request(app)
      .get("/api/articles?limit=&p=2")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 400: Responds with an error when the request value for limit or p is of incorrect type", () => {
    return request(app)
      .get("/api/articles?p=ten")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
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
  test("POST 404: Responds with an error if the article_id does not exist in the database", () => {
    const requestBody = {
      username: "rogersop",
      body: "Text from the comment..",
    };
    return request(app)
      .post("/api/articles/15/comments")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("POST 404: Responds with an error if the username does not exist in the database", () => {
    const requestBody = {
      username: "anyothername",
      body: "Text from the comment..",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("POST 400: Responds with an error when requested article_id is of incorrect datatype", () => {
    const requestBody = {
      username: "rogersop",
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
      username: "rogersop",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  ///////////////////////////////////
  test("GET 200: Responds with the first page of comments, default to 10 results, and the total number of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(10);
      });
  });
  test("GET 200: Responds with the first page of comments containing the number of comments passed in the query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(5);
      });
  });
  test("GET 200: Responds with the second page of comments when passed the page number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(1);
      });
  });
  test("GET 200: Responds with the requested page of comments when passed a page number and a limit number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2&limit=5")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(5);
      });
  });
  test("GET 200: Responds with the all the comments when limit number is higher than the number or comments for that request", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=20")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
      });
  });
  test("GET 404: Responds with an error when the requested page of comments does not have any results", () => {
    return request(app)
      .get("/api/articles/1/comments?p=3")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("GET 400: Responds with an error when the request is incomplete", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=&p=2")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 400: Responds with an error when the request value for limit or p is of incorrect type", () => {
    return request(app)
      .get("/api/articles/1/comments?p=ten")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("GET 400: Responds with an error when the query is not valid", () => {
    return request(app)
      .get("/api/articles/1/comments?page=2")
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

  test("PATCH 200: Increases the number of votes for the corresponding comment, when requestBody has votes property >0. Responds with the updated comment.", () => {
    const requestBody = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(requestBody)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 1,
          votes: 17,
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        });
      });
  });
  test("PATCH 200: Decreases the number of votes for the corresponding comment, when requestBody has votes property < 0. Responds with the updated comment.", () => {
    const requestBody = {
      inc_votes: -1,
    };
    return request(app)
      .patch("/api/comments/2")
      .send(requestBody)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: 2,
          votes: 13,
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        });
      });
  });
  test("PATCH 404: Responds with an error when comment_id is does not exist in the database", () => {
    const requestBody = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/20")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
  test("PATCH 400: Responds with an error when comment_id is is of incorrect datatype", () => {
    const requestBody = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/fifteen")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("PATCH 400: Responds with an error when requestBody votes property is is of incorrect datatype", () => {
    const requestBody = {
      inc_votes: "one",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
  test("PATCH 400: Responds with an error when requestBody does not have the correct property name", () => {
    const requestBody = {
      add_votes: 1,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad Request");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: Responds with an array with all the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET 200: Responds with the user with the correspondent username", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject({
          username: "lurker",
          avatar_url: expect.any(String),
          name: expect.any(String),
        });
      });
  });
  test("GET 404: Responds with an error when requested id does not exist in the database", () => {
    return request(app)
      .get("/api/users/newuser")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
});
