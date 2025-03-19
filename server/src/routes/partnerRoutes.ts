import { Router } from 'express';
import {
  registerPartner,
  getAllPartners,
  updatePartner,
  getPartnerById,
} from '../controllers/partnerController';

const router = Router();

router.get('/', getAllPartners);
router.post('/', registerPartner);
router.get('/:id', getPartnerById);
router.put('/:id', updatePartner);

export default router;