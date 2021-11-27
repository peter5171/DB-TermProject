var express = require('express');
const { runInsert } = require('../lib/user');

var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Express',
    userInfo: {
      id: 'asff',
    },
  });
});

router.get('/signin', (req, res) => {
  res.render('signin', { title: 'Express' });
});

router.post('/signin', (req, res) => {
  const { name, username, password, tel, card } = req.body;

  runInsert(
    'INSERT INTO 회원 VALUES (AUTO_INCREMENT_USER.nextval, :1, :2, DEFAULT, :3, :4, :5)',
    [name, tel, card, username, password]
  );
});

module.exports = router;
