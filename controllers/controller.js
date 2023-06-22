import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { userModel } from "../model/userModel.js";
import { taskModel } from "../model/taskModel.js";

export async function registerUser(req, res) {
  try {
    const { fullName, emailAddress, password, confirmPassword, phoneNumber } =
      req.body;
    const existingUser = await userModel.findOne({ emailAddress });
    if (existingUser) {
      return res.json({
        message: "emailAddress is already exist",
        status: false,
      });
    }
    if (password === confirmPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        userName: fullName,
        emailAddress: emailAddress,
        password: hashedPassword,
        phoneNumber: phoneNumber,
      });
      const validationError = newUser.validateSync();
      if (validationError) {
        throw new Error(validationError.message);
      }
      await newUser.save();
      res
        .status(200)
        .json({ message: "User registered successfully", status: true });
    } else {
      return res
        .status(400)
        .json({ message: "Password mismatch", status: false });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    console.log("KOKOOKKO");
    const { emailAddress, password } = req.body;
    const user = await userModel.findOne({ emailAddress });
    if (!user) {
      return res.json({ message: "wrong email", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ message: "Invalid password", status: false });
    }
    const token = generateToken(user._id);
    res.status(200).json({ token, message: "Login successful", status: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
}

export async function userProfile(req, res) {
  try {
    const { userId } = req.user;
    const user = await userModel.findOne({ _id: userId }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "page not found" });
  }
}

export function Auth(req, res) {
  res.json({ message: "yes", status: true });
}

export const editeProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { _id, emailAddress, userName, phoneNumber } = req.body;
    const existingUser = await userModel.findOne({ emailAddress });
    if (existingUser && existingUser._id != _id) {
      return res.json({ message: "Eamil is already exist", status: false });
    }
    const resp = await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          userName: userName,
          emailAddress: emailAddress,
          phoneNumber: phoneNumber,
        },
      }
    );
    return res
      .status(200)
      .json({ message: "saveed successfully", status: true });
  } catch (error) {
    res.status(500).json({ error: "page not found" });
  }
};

export const AddTodo = async (req, res) => {
  try {
    const { userId } = req.user;
    const task = new taskModel({
      name: req.body.task,
      userId: userId,
    });
    await task.save();
    return res
      .status(200)
      .json({ message: "saveed successfully", status: true, userTask: task });
  } catch (error) {
    res.status(500).json({ error: "page not found" });
  }
};

export const getTask = async (req, res) => {
  try {
    const { userId } = req.user;

    const task = (await taskModel.find({ userId })).reverse();
    return res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "page not found" });
  }
};

export const addSubTask = async (req, res) => {
  try {
    const { id, subTask } = req.body;
    console.log(id, subTask);
    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: id },
      { $push: { tasks: { taskName: subTask, checked: false } } },
      { new: true }
    );
    return res.status(200).json({
      message: " successfully updated",
      status: true,
      updatedTask: updatedTask.tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "page not found" });
  }
};

export const updatedCheckboxes = async (req, res) => {
  try {
    console.log(req.body);
    const { subTaskId, taskId, checkedType } = req.body;
    console.log(subTaskId, taskId);
    const task = await taskModel.findOneAndUpdate(
      { _id: taskId },
      { $set: { "tasks.$[elem].checked": checkedType } },
      {
        arrayFilters: [{ "elem._id": subTaskId }],
        new: true,
      }
    );
    return res.status(200).json({
      message: " successfully updated",
      status: true,
      updatedTask: task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "page not found" });
  }
};

export const removeTask = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTask = await taskModel.findByIdAndDelete(id);
    if (deletedTask) {
      return res
        .status(200)
        .json({ message: "Document deleted successfully", status: true });
    }
    return res
      .status(404)
      .json({ message: "Document not found", status: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "page not found" });
  }
};
