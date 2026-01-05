/**
 * 모든 요청에 대해 사용자의 로그인 여부를 확인하는 미들웨어
 */
function checkAuthStatus(req, res, next) {
    // 1. 세션에 저장된 'uid'(사용자 고유 ID)를 가져옵니다.
    // 로그인하지 않은 사용자는 이 값이 없습니다.
    const uid = req.session.uid;
    
    // 2. 만약 세션에 uid가 없다면(로그인하지 않은 상태)
    if (!uid) {
        // 아무것도 하지 않고 다음 미들웨어 혹은 라우터로 넘어갑니다.
        return next();
    }

    // 3. uid가 있다면(로그인한 상태) 
    // res.locals에 정보를 담아 모든 EJS 템플릿에서 이 변수들을 바로 쓸 수 있게 합니다.
    res.locals.uid = uid;      // 현재 로그인한 사용자의 ID 보관
    res.locals.isAuth = true;  // 로그인 여부를 true로 설정 (네비게이션 바 메뉴 분기 등에 사용)
    res.locals.isAdmin = req.session.isAdmin;
    
    // 4. 설정을 마쳤으므로 다음 단계로 진행합니다.
    next();
}

module.exports = checkAuthStatus;