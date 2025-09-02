import express from 'express';
import {
    createTask,
    getAllTasks,
    updateTaskStatus,
    deleteTask,
    getTaskAnalytics
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/analytics', getTaskAnalytics);
router.put('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
