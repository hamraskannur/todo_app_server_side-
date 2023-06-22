import { Router } from "express";
import { authenticateUser } from '../middleware/authenticateUser.js'
import { registerUser, loginUser, userProfile,Auth, editeProfile,AddTodo, getTask, addSubTask, updatedCheckboxes, removeTask} from '../controllers/controller.js'

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateUser, userProfile);
router.post('/authenticate', authenticateUser,Auth)
router.put('/editeProfile', authenticateUser,editeProfile)
router.post('/addTask', authenticateUser,AddTodo)
router.get('/getTask', authenticateUser,getTask)
router.put('/addSubTask', authenticateUser,addSubTask)
router.put('/updatedCheckboxes', authenticateUser,updatedCheckboxes)
router.delete('/removeTask/:id', authenticateUser,removeTask)



export default router;