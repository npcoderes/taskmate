import express from 'express';
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateProfile, 
    updateProfilePic,
    updatePassword
} from '../controllers/userController.js';
import authenticateToken from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/profile-pic', authenticateToken, upload.single('profilePic'), updateProfilePic);
router.put('/password', authenticateToken, updatePassword);

export default router;
