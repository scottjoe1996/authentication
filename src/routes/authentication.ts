import express from 'express';

import healthCheck from '../controllers/authentication';

const router = express.Router();

router.get('/ping', healthCheck);

export = router;
