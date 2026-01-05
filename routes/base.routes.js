const express = require("express");

const router = express.Router(); 

/**
 * 기본 홈 경로 처리
 */
// [GET] / : 사용자가 아무런 경로 없이 메인 도메인(localhost:3000)으로 접속했을 때 실행
router.get("/", (req, res) => {
    // 1. 초기 화면을 상품 목록 페이지로 보여주기 위해 "/products" 경로로 리다이렉트(이동) 시킵니다.
    // 2. 사용자는 브라우저 창에 주소를 입력하자마자 자동으로 /products 페이지를 보게 됩니다.
    res.redirect("/products");
});

// 설정한 라우터 객체를 내보내어 app.js에서 기본 경로로 등록할 수 있게 함
module.exports = router;