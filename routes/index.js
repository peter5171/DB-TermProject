import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { ensureLoggedOut } from "connect-ensure-login";

import { runInsert } from "../lib/user";

var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", {
    title: "Express",
    userInfo: {
      id: "asff",
    },
  });
});

router.get("/signin", ensureLoggedOut({ redirectTo: "/" }), (req, res) => {
  res.render("signin", { title: "Express" });
});

router.post(
  "/signin",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res) => {
    const { name, username, password, tel, card } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    runInsert("INSERT INTO 회원 VALUES (:1, :2, :3, DEFAULT, :4, :5)", [
      username,
      name,
      tel,
      card,
      hashedPassword,
    ]);
  }
);

router.get("/login", ensureLoggedOut({ redirectTo: "/" }), (req, res) => {
  res.render("login", {
    title: "Express",
  });
});

router.post(
  "/login",
  //로그아웃 상태 확인
  ensureLoggedOut({ redirectTo: "/" }),
  //로그인 하는 부분
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);

export default router;
