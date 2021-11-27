import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { ensureLoggedOut } from 'connect-ensure-login';

import { runInsert } from '../lib/user';

var router = express.Router();

router.get('/', (req, res) => {
  res.render('admin', { title: 'Express' });
});

export default router;
