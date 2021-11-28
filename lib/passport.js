require('dotenv').config();
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { runSelect } from './db';

const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

function passportConfig() {
  passport.serializeUser((user, done) => {
    // Strategy 성공 시 호출됨
    done(null, user.아이디);
  });
  passport.deserializeUser((id, done) => {
    // 매개변수 id는 req.session.passport.user에 저장된 값
    runSelect(
      'SELECT 회원이름, 휴대전화, 카드번호, 아이디, 회원.등급 AS 등급, 할인율.할인율 AS 할인율 FROM 회원 JOIN 할인율 ON 할인율.등급 = 회원.등급 WHERE 아이디 = :1',
      [id]
    ).then((user) => {
      console.log(id, user);
      done(null, user[0]);
    });
  });

  passport.use(
    new LocalStrategy(
      {
        // local 전략을 세움
        usernameField: 'username',
        passwordField: 'password',
        session: true, // 세션에 저장 여부
      },
      (username, password, done) => {
        if (username === ADMIN_USERNAME) {
          if (password === ADMIN_PASSWORD) {
            return done(null, { 아이디: ADMIN_USERNAME });
          } else return done(null, false);
        }
        runSelect('SELECT * FROM 회원 WHERE 아이디 = :1', [username])
          .then((data) => {
            console.log(data);
            const user = data[0];
            if (!user) return done(null, false);
            bcrypt.compare(password, user.비밀번호).then((result) => {
              if (result) {
                delete user.비밀번호;
                return done(null, user);
              } else return done(null, false);
            });
          })
          .catch((err) => done(err));
      }
    )
  );
}

export default passportConfig;
