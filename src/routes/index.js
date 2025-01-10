import express from 'express';
import cryptoController from '../controllers/cryptoController.js';

const router = express.Router();

router.get('/stats', cryptoController.getStats.bind(cryptoController));
router.get('/deviation', cryptoController.getDeviation.bind(cryptoController));

export default router;