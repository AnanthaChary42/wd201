"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) { }

    static addTodo({ title, dueDate }) {
      return this.create({ title, dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll();
    }

    static async overdue() {
      return this.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toISOString().split("T")[0] },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      return this.findAll({
        where: {
          dueDate: new Date().toISOString().split("T")[0],
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      return this.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toISOString().split("T")[0] },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async remove(id) {
      return this.destroy({ where: { id } });
    }

    // ✅ New method to set completion status
    async setCompletionStatus(status) {
      return this.update({ completed: status });
    }
  }

  Todo.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      dueDate: { type: DataTypes.DATEONLY, allowNull: false },
      completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );

  return Todo;
};
