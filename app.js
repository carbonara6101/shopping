const path = require("path");

const express = require("express");
const csrf = require("csurf"); // CSRF(사이트 간 요청 위조) 공격을 방지하기 위한 보안 토큰 패키지
const expressSession = require("express-session"); // 서버와 브라우저 간의 세션 관리를 위한 패키지

// 사용자 정의 설정 및 미들웨어 로드
const createSessionConfig = require("./config/session"); // 세션 저장소 및 쿠키 설정 가져오기
const db = require("./data/database"); // MongoDB 연결 함수 가져오기
const addCsrfTokenMiddleware = require("./middlewares/csrf-token"); // 생성된 CSRF 토큰을 뷰(EJS)에 전달하는 함수
const errorHandlerMiddleware = require("./middlewares/error-handler"); // 서버 에러 발생 시 처리하는 중앙 미들웨어
const checkAuthStatusMiddleware = require("./middlewares/check-auth"); // 세션 정보를 확인해 로그인 여부를 전역 변수로 설정하는 함수

// 라우터(경로 설정) 로드
const authRoutes = require("./routes/auth.routes"); // 로그인, 회원가입 관련 경로
const productRoutes = require("./routes/products.routes"); // 상품 목록 관련 경로
const baseRoutes = require("./routes/base.routes"); // 기본 홈(/) 경로

const app = express();

// --- 뷰 엔진 설정 ---
app.set("view engine", "ejs"); // 템플릿 엔진으로 EJS 사용 선언
app.set("views", path.join(__dirname, "views")); // 뷰 파일들이 위치한 폴더 경로 지정

// --- 공통 미들웨어 설정 ---
// 1. 정적 파일 서비스: public 폴더 안의 CSS, 이미지, 클라이언트 JS 파일들을 외부에서 접근 가능하게 함
app.use(express.static("public"));

// 2. 바디 파서: HTML Form 태그로 전송된 데이터를 해석하여 req.body 객체에 담아줌
app.use(express.urlencoded({ extended: false }));

// 3. 세션 설정: 요청마다 세션을 활성화 (CSRF 미들웨어보다 반드시 먼저 위치해야 함)
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

// 4. CSRF 설정: 이후 발생하는 모든 POST 요청 등에 대해 보안 토큰 검증을 실시함
app.use(csrf());

// 5. 전역 데이터 설정 미들웨어
app.use(addCsrfTokenMiddleware); // 모든 뷰에서 CSRF 토큰을 사용할 수 있게 등록
app.use(checkAuthStatusMiddleware); // 모든 뷰에서 로그인 여부(isAuth)를 확인할 수 있게 등록

// --- 라우터 연결 (순서대로 요청을 확인) ---
app.use(baseRoutes); // "/" 경로 처리 (보통 /products로 리다이렉트)
app.use(authRoutes); // "/signup", "/login" 등 인증 관련 경로 처리
app.use(productRoutes); // "/products" 등 상품 관련 경로 처리

// --- 에러 핸들링 ---
// 7. 에러 처리 미들웨어: 위 라우트들에서 발생한 모든 에러는 마지막에 여기서 처리함
app.use(errorHandlerMiddleware);

// --- 서버 구동 ---
// 8. DB 연결을 시도하고, 성공했을 경우에만 3000번 포트로 서버를 엽니다.
db.connectToDatabase()
  .then(() => {
    app.listen(3000);
    console.log("Server connected to DB & Running on Port 3000");
  })
  .catch((error) => {
    console.log("Failed to connect to the database!");
    console.log(error);
  });