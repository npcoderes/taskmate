import express from 'express';
import {
    createTask,
    getAllTasks,
    updateTaskStatus,
    deleteTask,
    getTaskAnalytics
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/auth.js'

const router = express.Router();
router.use(authMiddleware)

router.post('/',authMiddleware, createTask);
router.get('/', authMiddleware,getAllTasks);
router.get('/analytics', authMiddleware,getTaskAnalytics);
router.put('/:id', authMiddleware,updateTaskStatus);
router.delete('/:id', authMiddleware,deleteTask);

export default router;
