const { model, Schema, Types } = require('mongoose');

const TasksModel = new Schema(
  {
    title: {
      type: String,
      minlength: [3, 'Title is too short'],
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    user: {
      type: Schema.ObjectId,
      ref: 'user',
      required: [true, 'Task should belong to user'],
    },
  },
  { timestamps: true }
);

TasksModel.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name _id',
  });
  next();
});

module.exports = model('tasks', TasksModel);
