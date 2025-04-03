const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("Todolist Test Suite", () => {
  const pastDate = "2024-03-30";
  const futureDate = "2025-04-10";
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    add({
      title: "Overdue todo",
      completed: false,
      dueDate: pastDate,
    });

    add({
      title: "Future todo",
      completed: false,
      dueDate: futureDate,
    });
  });

  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("checks creating a new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("checks marking a todo as completed", () => {
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("checks retrieval of overdue items.", () => {
    const a = overdue();
    expect(a.length).toBeGreaterThan(0);
    expect(new Date(a[0].dueDate) < new Date()).toBe(true);
  });
  test("checks retrieval of due today items.", () => {
    const a = dueToday();
    expect(a.length).toBeGreaterThan(0);
    expect(a[0].dueDate).toBe(new Date().toISOString().slice(0, 10));
  });
  test("checks retrieval of due later items.", () => {
    const a = dueLater();
    expect(a.length).toBeGreaterThan(0);
    expect(new Date(a[0].dueDate) > new Date()).toBe(true);
  });
});
