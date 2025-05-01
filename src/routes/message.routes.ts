import { Router } from 'express';
import { getMessages } from '../controllers/message.controller';

const router = Router();

router.get('/', getMessages);

export default router;
