import express from 'express';

import { changeAdminSetPassword, getAuthenticationToken, healthCheck, isTokenValid } from '../controllers/authentication';

const router = express.Router();

router.get('/ping', healthCheck);
router.get('/token', getAuthenticationToken);
router.post('/token', isTokenValid);
router.post('/change-admin-set-password', changeAdminSetPassword);

export = router;
