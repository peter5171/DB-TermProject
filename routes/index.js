import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login';

import { getImage, runInsert, runSelect } from '../lib/db';
import OracleDB from 'oracledb';

var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  if (req.user && req.user.admin) return res.redirect('/admin');
  res.render('index', {
    title: 'Express',
    loggedIn: req.user ? true : false,
  });
});

router.get('/signin', ensureLoggedOut({ redirectTo: '/' }), (req, res) => {
  res.render('signin', { title: 'Express' });
});

router.post(
  '/signin',
  ensureLoggedOut({ redirectTo: '/' }),
  async (req, res) => {
    const { name, username, password, tel, card } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    runInsert('INSERT INTO 회원 VALUES (:1, :2, :3, DEFAULT, :4, :5)', [
      username,
      name,
      tel,
      card,
      hashedPassword,
    ]);
    res.redirect('/login');
  }
);

router.get('/login', ensureLoggedOut({ redirectTo: '/' }), (req, res) => {
  res.render('login', {
    title: 'Express',
  });
});

router.post(
  '/login',
  //로그아웃 상태 확인
  ensureLoggedOut({ redirectTo: '/' }),
  //로그인 하는 부분
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
  })
);

router.get(
  '/logout',
  ensureLoggedIn({ setReturnTo: true, redirectTo: '/login' }),
  (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect('/');
    });
  }
);

router.get(
  '/mypage',
  ensureLoggedIn({ setReturnTo: true, redirectTo: '/login' }),
  (req, res) => {
    res.render('mypage', {
      title: 'Express',
      user: req.user,
      loggedIn: req.user ? true : false,
    });
  }
);

router.post(
  '/mypage',
  ensureLoggedIn({ setReturnTo: true, redirectTo: '/login' }),
  async (req, res) => {
    const { username, password, name, tel, card } = req.body;

    let sql,
      data = [];
    if (password && password !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql =
        'UPDATE 회원 SET 비밀번호 = :1, 회원이름 = :2, 휴대전화 = :3, 카드번호 = :4 WHERE 아이디 = :5';
      data.push(hashedPassword, name, tel, card, username);
    } else {
      sql =
        'UPDATE 회원 SET 회원이름 = :1, 휴대전화 = :2, 카드번호 = :3 WHERE 아이디 = :4';
      data.push(name, tel, card, username);
    }
    runInsert(sql, data);
    res.redirect('/mypage');
  }
);

router.post(
  '/mypage/delete',
  ensureLoggedIn({ setReturnTo: true, redirectTo: '/login' }),
  async (req, res) => {
    runInsert('DELETE FROM 회원 WHERE 아이디 = :1', [req.user.아이디]);
    req.session.destroy((err) => {
      if (err) throw err;
      res.json({ success: true });
    });
  }
);

router.get('/viewmv', async (req, res) => {
  const movies = await runSelect(
    'SELECT 영화번호, 영화제목, 영화감독, 주연배우,포스터 FROM 영화',
    []
  );
  res.render('viewmv', { title: 'Express', movies });
});

router.post('/viewmv', (req, res) => {
  res.render('viewmv', { title: 'Express' });
});

router.get('/viewschedule', async (req, res) => {
  const schedules = await runSelect(
    'SELECT 영화번호, 상영시간, 상영관번호, 요금 FROM 상영스케줄',
    []
  );

  res.render('viewschedule', { title: 'Express', schedules });
});

router.post('/viewschedule', (req, res) => {
  res.render('viewschedule', { title: 'Express' });
});

router.get('/poster/:id', async (req, res) => {
  const { id } = req.params;

  const poster = await getImage('SELECT 포스터 FROM 영화 WHERE 영화번호 = :1', [
    id,
  ]);
  console.log(poster[0][0]);

  res.send(poster[0][0]);
});
export default router;
