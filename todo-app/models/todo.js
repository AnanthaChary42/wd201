"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      // define association here
    }

    // Add a new todo
    static addTodo({ title, dueDate }) {
      return this.create({ title, dueDate, completed: false });
    }

    // Get all todos
    static getTodos() {
      return this.findAll();
    }

    // Get overdue todos
    static async overdue() {
      return this.findAll({
        where: {
          dueDate: {
            [sequelize.Op.lt]: new Date().toISOString().split("T")[0],
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    // Get todos due today
    static async dueToday() {
      return this.findAll({
        where: {
          dueDate: new Date().toISOString().split("T")[0],
        },
        order: [["id", "ASC"]],
      });
    }

    // Get todos due later
    static async dueLater() {
      return this.findAll({
        where: {
          dueDate: {
            [sequelize.Op.gt]: new Date().toISOString().split("T")[0],
          },
        },
        order: [["dueDate", "ASC"]],
      });
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }

    // Mark a todo as completed
    markAsCompleted() {
      return this.update({ completed: true });
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );

  return Todo;
};
