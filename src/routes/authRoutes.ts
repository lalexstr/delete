import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRegister, validateLogin, validateUpdateUser } from '../middleware/validation';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateUpdateUser, updateProfile);

export default router;
