import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    require: true,
  },
  tasks: [
    {
      taskName: {
        type: String,
      },
      checked: {
        type: Boolean,
      },
    },
  ],
});

export const taskModel = mongoose.model("task", taskSchema);
