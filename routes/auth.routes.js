const express = require("express");

// 인증 로직(회원가입, 로그인, 로그아웃)을 담당하는 컨트롤러 함수들을 가져옵니다.
const authController = require("../controllers/auth.controller");

const router = express.Router(); 

/**
 * 회원가입 관련 경로
 */
// [GET] /signup: 사용자가 회원가입 페이지를 요청했을 때 화면(View)을 띄워줌
router.get("/signup", authController.getSignup);

// [POST] /signup: 사용자가 회원가입 양식을 작성해 제출했을 때 DB에 데이터를 저장함
router.post("/signup", authController.signup);

/**
 * 로그인 관련 경로
 */
// [GET] /login: 사용자가 로그인 페이지를 요청했을 때 화면(View)을 띄워줌
router.get("/login", authController.getLogin);

// [POST] /login: 사용자가 아이디/비번을 입력해 제출했을 때 자격 증명을 확인하고 세션을 생성함
router.post("/login", authController.login);

/**
 * 로그아웃 관련 경로
 */
// [POST] /logout: 사용자가 로그아웃 버튼을 눌렀을 때 세션 정보를 파기하는 로직을 실행함
// 💡 보안을 위해 GET이 아닌 POST 방식을 사용하여 의도치 않은 로그아웃을 방지합니다.
router.post("/logout", authController.logout);

// 설정한 라우터 객체를 내보내어 app.js에서 사용할 수 있도록 함
module.exports = router;