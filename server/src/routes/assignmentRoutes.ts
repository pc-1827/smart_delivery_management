import { Router } from 'express';
import { 
    createAssignment, 
    getAssignments, 
    updateAssignment, 
    deleteAssignment,
    autoAssignOrders
} from '../controllers/assignmentController';

const router = Router();

router.post('/', createAssignment);
router.get('/', getAssignments);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);
router.post('/auto-assign', autoAssignOrders);

export default router;