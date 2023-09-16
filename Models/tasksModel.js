const { Schem, model, Schema } = require("mongoose");
const UserModel = require("./userModel");

const TasksModel = new Schema(
  {
    title: {
      type: String,
      minlength: [5, "Title is too short"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [5, "Description is too short"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    date: String,
    status: {
      type: String,
      enum: ["ongoing", "complete", "incomplete"],
      default: "incomplete",
    },
    user: {
      type: Schema.ObjectId,
      ref: "user",
      required: [true, "Task should belong to user"],
    },
  },
  { timestamps: true }
);

TasksModel.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name _id",
  });
  next();
});

module.exports = model("tasks", TasksModel);
