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

router.get('/movie', async (req, res) => {
  const movies = await runSelect(
    'SELECT 영화번호, 영화제목, 영화감독, 주연배우,포스터 FROM 영화',
    []
  );
  res.render('movie', { title: 'Express', movies });
});

router.post('/movie', async (req, res) => {
  res.render('movie', { title: 'Express' });
});

router.get('/addmovie', (req, res) => {
  res.render('addmovie', { title: 'Express' });
});

router.post('/addmovie', async (req, res) => {
  const { title, director, actor } = req.body;
  console.log(title, director, actor, req.files.poster);
  runInsert(
    'INSERT INTO 영화 VALUES (AUTO_INCREMENT_MOVIE.nextval, :1, :2, :3, :4)',
    [title, director, actor, req.files.poster.data]
  );
  res.redirect('/admin/movie');
});

router.get('/schedule', async (req, res) => {
  const schedules = await runSelect(
    'SELECT 영화번호, 상영시간, 상영관번호, 요금 FROM 상영스케줄',
    []
  );
  res.render('schedule', { title: 'Express', schedules });
});

router.post('/schedule', async (req, res) => {
  res.render('schedule', { title: 'Express' });
});

router.get('/addschedule/:id', (req, res) => {
  const { id } = req.params;
  res.render('addschedule', { title: 'Express', id });
});

router.post('/addschedule/:id', async (req, res) => {
  const { id } = req.params;
  const { mvdate, mvtime, teanum, cost } = req.body;
  const date = new Date(`${mvdate} ${mvtime}:00`);

  console.log(parseInt(cost));

  runInsert(
    'INSERT INTO 상영스케줄 (영화번호, 상영시간, 상영관번호, 요금) VALUES (:1, :2, :3, :4)',
    [id, date, teanum, parseInt(cost)]
  );
});
export default router;
