import { Router } from 'express';
import { createFlow, deleteFlow, getFlow, getFlows, updateFlow } from '../controllers/flow.controller';

const router = Router();

router.post('/', createFlow);
router.get('/', getFlows);
router.get('/:id', getFlow);
router.put('/:id', updateFlow);
router.delete('/:id', deleteFlow);

export default router;
