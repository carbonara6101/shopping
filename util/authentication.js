/**
 * [세션 생성] 사용자가 로그인을 성공했을 때 서버 측 세션에 사용자 정보를 기록하는 함수
 * @param {object} req - 익스프레스 요청 객체 (세션 데이터 수정을 위해 필요)
 * @param {object} user - DB에서 성공적으로 조회된 사용자 객체
 * @param {function} action - 세션 저장이 완료(DB 반영 완료)된 후 실행할 후속 작업(콜백 함수)
 */
function createUserSession(req, user, action) {
    // 1. 사용자의 MongoDB 고유 ID(_id)를 가져와 세션의 'uid' 속성에 저장합니다.
    // .toString()을 붙여서 객체 타입이 아닌 순수한 문자열로 저장하는 것이 안전합니다.
    req.session.uid = user._id.toString();

    req.session.isAdmin = user.isAdmin;

    // 2. 변경된 세션 데이터를 세션 저장소(MongoDB)에 즉시 강제 저장합니다.
    // 저장 처리가 완전히 끝난 시점에 action(예: 리다이렉트)을 실행하여 
    // 페이지 이동 후 세션이 바로 인식되지 않는 문제를 방지합니다.
    req.session.save(action);
}

/**
 * [세션 삭제/초기화] 로그아웃 시 사용자의 인증 정보를 세션에서 제거하는 함수
 * @param {object} req - 익스프레스 요청 객체
 */
function destroyUserAuthSession(req) {
    // 세션에 담긴 uid 값을 null(빈 값)로 만들어 로그인 상태를 해제합니다.
    // 💡 팁: 세션 전체를 삭제하는 req.session.destroy() 방식도 있지만,
    // 이 방식처럼 특정 값(uid)만 비우면 장바구니 정보 같은 비인증 데이터는 유지할 수 있습니다.
    req.session.uid = null;
}

// 다른 파일(특히 auth.controller.js)에서 이 인증 로직들을 사용할 수 있도록 내보냅니다.
module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession
};  