import express from 'express';

import { getAuthenticationToken, healthCheck, isTokenValid } from '../controllers/authentication';

const router = express.Router();

router.get('/ping', healthCheck);
router.get('/token', getAuthenticationToken);
router.post('/token', isTokenValid);

export = router;
