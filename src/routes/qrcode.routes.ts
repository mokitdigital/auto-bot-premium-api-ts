import { Router } from 'express';
import { getQrCode } from '../controllers/qrcode.controller';

const router = Router();

router.get('/', getQrCode);

export default router;
