import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAllTasks,
} from '../controllers/taskController';
import { authenticate, authorize } from '../middleware/auth';
import { validateCreateTask, validateUpdateTask, validateTaskQuery } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.post('/', validateCreateTask, createTask);
router.get('/', validateTaskQuery, getTasks);
router.get('/:id', getTaskById);
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

router.get('/admin/all', authorize('admin'), validateTaskQuery, getAllTasks);

export default router;