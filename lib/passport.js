import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { runSelect } from './user';

function passportConfig() {
  passport.serializeUser((user, done) => {
    // Strategy 성공 시 호출됨
    done(null, user.username);
  });
  passport.deserializeUser((id, done) => {
    // 매개변수 id는 req.session.passport.user에 저장된 값
    done(null, id);
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
        runSelect('SELECT * FROM 회원 WHERE 아이디 = :1', [username]).then(
          (data) => {
            console.log(data);
            const user = data[0];
            if (!user) return done(null, false);
          }
        );
      }
    )
  );
}

export default passportConfig;
