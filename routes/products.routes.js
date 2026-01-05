const express = require("express");

const router = express.Router(); 

/**
 * 상품 목록 관련 경로 설정
 */
// [GET] /products : 사용자가 '모든 상품 보기' 페이지에 접근했을 때 실행
router.get("/products", (req, res) => {
    // 1. views/custom/products/all-products.ejs 파일을 렌더링합니다.
    // 2. 이 페이지에는 DB에서 가져온 상품들의 리스트가 화면에 표시될 예정입니다.
    res.render("custom/products/all-products");
});

// 다른 파일(주로 app.js)에서 이 라우터 설정을 사용할 수 있도록 내보냅니다.
module.exports = router;