/**
 * [보조 함수] 값이 비어있는지 확인합니다.
 * @param {string} value - 검사할 문자열
 * @returns {boolean} - 비어있으면 true, 값이 있으면 false
 */
function isEmpty(value) {
  // value가 없거나(null, undefined), 공백을 제거했을 때 빈 문자열이면 true 반환
  return !value || value.trim() === "";
}

/**
 * [보조 함수] 이메일 형식과 비밀번호 길이를 확인합니다.
 * @param {string} email 
 * @param {string} password 
 */
function userCredentialsAreValid(email, password) {
  return (
    email && 
    email.includes("@") &&          // 이메일에 @ 기호가 포함되어 있는지 확인
    password && 
    password.trim().length >= 6     // 비밀번호가 최소 6글자 이상인지 확인
  );
}

/**
 * [메인 검증 함수] 모든 회원 정보가 유효한지 통합 확인합니다.
 * 💡 주의: 함수명에 'Details' 대신 'Datils'로 오타가 있습니다. 
 * 컨트롤러에서 호출할 때 이 이름과 똑같이 맞추거나, 여기서 수정해야 합니다.
 */
function userDetailsAreValid(email, password, name, street, postal, city) {
  return (
    userCredentialsAreValid(email, password) && // 이메일/비밀번호 검사 통과 여부
    !isEmpty(name) &&   // 이름이 비어있지 않은지
    !isEmpty(street) && // 도로명 주소가 비어있지 않은지
    !isEmpty(postal) && // 우편번호가 비어있지 않은지
    !isEmpty(city)      // 도시 이름이 비어있지 않은지
  );
}

/**
 * [이메일 확인 검사] 이메일 주소 두 번 입력한 값이 서로 일치하는지 확인합니다.
 */
function emailIsConfirmed(email, confirmEmail) {
  return email == confirmEmail;
}

// 외부 파일(auth.controller.js)에서 사용할 수 있도록 함수들을 내보냅니다.
module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  emailIsConfirmed: emailIsConfirmed,
};