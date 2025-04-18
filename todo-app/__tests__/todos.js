"use strict";
const app = require("../app");
const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => { });
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  // Test creating a todo
  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);

    const response = await agent
      .post("/todos")
      .send({
        title: "Buy milk",
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken,
      });

    expect(response.statusCode).toBe(302);  // assuming redirect after creation
  });

  // Test marking a todo as complete
  test("Mark a todo as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        completed: true,
        _csrf: csrfToken,
      });

    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  // Test deleting a todo
  test("Deletes a todo with the given ID if it exists", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);

    const createResponse = await agent
      .post("/todos")
      .send({
        title: "Buy milk",
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken,
      });

    const createdTodo = JSON.parse(createResponse.text);
    const deleteResponse = await agent
      .delete(`/todos/${createdTodo.id}`)
      .send({ _csrf: csrfToken });

    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.text).toBe("true");  // Assuming success message is "true"

    // Ensure it's deleted
    const fetchResponse = await agent.get(`/todos/${createdTodo.id}`);
    expect(fetchResponse.body).toBeNull();  // Todo should no longer exist
  });
});
