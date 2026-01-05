/**
 * Express 전용 에러 핸들링 미들웨어
 * 인자가 4개(error 포함)여야 에러 미들웨어로 작동합니다.
 */
function handleError(error, req, res, next) {
    // 1. 개발자가 문제를 파악할 수 있도록 터미널 콘솔에 에러 내용을 출력합니다.
    console.log(error);
    
    // 2. 브라우저에게는 500(서버 내부 오류) 상태 코드를 보냅니다.
    // 3. 사용자에게는 친절한 안내 문구가 적힌 500.ejs 페이지를 보여줍니다.
    res.status(500).render("shared/500.ejs");
}

module.exports = handleError;