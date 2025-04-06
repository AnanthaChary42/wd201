const { Where } = require("sequelize/lib/utils");
const { connect } = require("./connectDB.js");
const Todo = require("./TodoModel.js");

const createTodo = async () => {
  try {
    await connect();
    const todo = await Todo.addTask({
      title: " second todo",
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created todo: ${todo.id}`);
  } catch (error) {
    console.error(error);
  }
};

const countItems = async () => {
  try {
    const totalCount = await Todo.count();
    console.log(`Found ${totalCount} items in the table!`);
  } catch (error) {
    console.error(error);
  }
};

const getallItems = async () => {
  try {
    const todo = await Todo.findAll();
    const todoString = todo.map((todo) => todo.displayableString()).join("\n");
    console.log(todoString);
  } catch (error) {
    console.error(error);
  }
};

const singletodo = async () => {
  try {
    const todo = await Todo.findOne();

    console.log(todo.displayableString());
  } catch (error) {
    console.error(error);
  }
};

const updateTodo = async (id) => {
  try {
    await Todo.update(
      {
        completed: true,
      },
      {
        Where: { id: id },
      },
    );
  } catch (error) {
    console.error(error);
  }
};

const deleteTodo = async (id) => {
  try {
    const count = await Todo.destroy({
      where: { id: id },
    });
    console.log(`Deleted ${count} rows`);
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  //await createTodo();
  await countItems();
  await getallItems();
  // await singletodo();
  await deleteTodo(6);
  await countItems();
})();
