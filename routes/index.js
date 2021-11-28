import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { ensureLoggedIn, ensureLoggedOut } from 'connect-ensure-login';

import { runInsert } from '../lib/db';

var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
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

export default router;
