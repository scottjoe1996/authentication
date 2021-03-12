import express from 'express';

import healthCheck from '../controllers/authorisation';

const router = express.Router();

router.get('/ping', healthCheck);

export = router;
