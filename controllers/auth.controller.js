const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation"); // [추가] 입력값 검증 유틸리티 불러오기
const sessionFlash = require("../util/session-flash");

/**
 * [GET] 회원가입 페이지 요청 처리
 */
function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData){
    sessionData = {
      email : "",
      confirmEmail : "",
      password : "",
      fullname : "",
      street : "",
      postal : "",
      city : "",
    };
  }

  res.render("custom/auth/signup", { inputData : sessionData });
}

/**
 * [POST] 회원가입 데이터 제출 처리 (유효성 검사 로직 포함)
 */
async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail : req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  // 1. [유효성 검사 - 형식 확인]
  if (
    !validation.userDetailsAreValid(
      // [주석] 이메일 형식, 비밀번호 길이, 주소 입력여부 등을 체크
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"]) // [주석] 이메일과 이메일 확인 값이 일치하는지 체크
  ) {
    // 하나라도 조건에 맞지 않으면 DB 작업을 하지 않고 다시 회원가입 페이지로 보냄
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Plz check your input. Password must be at least 6 characters. long postal code must be 5 characters long",
        ...enteredData,
      },
      () => {
        res.redirect("/signup");
      }
    );
    return;
  }

  // 2. 입력된 데이터를 바탕으로 임시 User 객체 생성
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    // 3. [유효성 검사 - 중복 확인]
    // DB에 이미 같은 이메일을 사용하는 사용자가 있는지 확인합니다.
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      // 이미 가입된 이메일이라면 가입을 중단하고 리다이렉트
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already! Try logging in instead!",
          ...enteredData,
        },
        () => {
          res.redirect("/signup");
        }
      );
      return;
    }

    // 4. 모든 검증을 통과했으므로 실제 DB에 사용자 저장
    await user.signup();
  } catch (error) {
    return next(error);
  }

  res.redirect("/login");
}

/**
 * [GET] 로그인 페이지 요청 처리
 */
function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email : "",
      password : "",
    }
  }

  res.render("custom/auth/login" , { inputData : sessionData });
}

/**
 * [POST] 로그인 데이터 제출 처리
 */
async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);

  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  const sessionErrorData = {
    errorMessage:
      "Invalid credentials - plz double-check your email and password!",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect("/login");
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, () => {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
    res.redirect("/");
  });
}

/**
 * [POST] 로그아웃 요청 처리
 */
function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
