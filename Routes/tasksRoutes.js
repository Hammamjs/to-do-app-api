const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  getTask,
  deleteTask,
  ongoingTask,
  completeTask,
  insertUserId,
} = require("../Services/tasksServices");

const auth = require("../Services/authServices");
const {
  createTaskValidator,
  getTaskValidator,
  deleteTaskValidator,
  updateTaskValidator,
} = require("../utils/validator/tasksValidator");
const router = express.Router({ mergeParams: true });

// router.use(auth.protect);

router
  .route("/")
  .get(getTasks)
  .post(
    auth.protect,
    auth.allowedTo("user"),
    insertUserId,
    createTaskValidator,
    createTask
  );

router
  .route("/:id")
  .get(auth.protect, auth.allowedTo("admin", "user"), getTaskValidator, getTask)
  .put(auth.protect, auth.allowedTo("user"), updateTaskValidator, updateTask)
  .delete(auth.allowedTo("user", "admin"), deleteTaskValidator, deleteTask);

// Change task status
router.put("/:id/status/ongoing", ongoingTask);
router.put("/:id/status/complete", completeTask);

module.exports = router;
