import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { ensureLoggedOut } from 'connect-ensure-login';

import { runInsert, runSelect } from '../lib/db';

var router = express.Router();

router.get('/', async (req, res) => {
  const users = await runSelect('SELECT 아이디, 회원이름, 등급 FROM 회원', []);

  res.render('admin', { title: 'Express', users });
});

router.post('/', (req, res) => {
  const { username, rank } = req.body;

  runInsert('UPDATE 회원 SET 등급 = :1 WHERE 아이디 = :2', [rank, username]);
  res.redirect('/admin');
});

router.get('/movie', (req, res) => {
  res.render('movie', { title: 'Express' });
});

router.post('/movie', async (req, res) => {
  res.render('movie', { title: 'Express' });
});

router.get('/addmovie', (req, res) => {
  res.render('addmovie', { title: 'Express' });
});

router.post('/addmovie', async (req, res) => {
  const { title, director, actor } = req.body;
  console.log(title, director, actor, req.files.poster.data);
  runInsert(
    'INSERT INTO 영화 VALUES (AUTO_INCREMENT_MOVIE.nextval, :1, :2, :3, :4)',
    [title, director, actor, req.files.poster.data]
  );
  res.redirect('/admin/movie');
});

router.get('/schedule', (req, res) => {
  res.render('schedule', { title: 'Express' });
});

router.post('/schedule', async (req, res) => {
  res.render('schedule', { title: 'Express' });
});

router.get('/addschedule', (req, res) => {
  res.render('addschedule', { title: 'Express' });
});

router.post('/addschedule', async (req, res) => {
  const { poster, mvnum, mvtitle, mvpd, actor } = req.body;

  runInsert('INSERT INTO 상영시간 VALUES (:1, :2, :3, :4)', [
    mvnum,
    teatime,
    teanum,
    cost,
  ]);
});
export default router;
