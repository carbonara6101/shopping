/**
 * CSRF 토큰을 모든 뷰(EJS)에서 사용할 수 있도록 설정하는 미들웨어
 */
function addCsrfToken(req, res, next) {
  // 1. res.locals는 현재 요청에 응답하는 모든 뷰(EJS 파일)에서 공통으로 접근 가능한 변수를 저장합니다.
  // 2. req.csrfToken() 함수를 호출하여 고유한 보안 토큰을 생성합니다.
  // 3. 생성된 토큰을 'csrfToken'이라는 이름으로 저장하여, EJS 파일 내에서 바로 <%= csrfToken %>으로 쓸 수 있게 합니다.
  res.locals.csrfToken = req.csrfToken();

  // 4. 설정이 끝났으므로 다음 미들웨어 혹은 라우터 핸들러로 처리를 넘깁니다.
  next();
}

module.exports = addCsrfToken;