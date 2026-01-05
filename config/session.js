const expressSession = require("express-session"); // 세션 관리 핵심 도구
const mongoDbStore = require("connect-mongodb-session"); // 세션을 MongoDB에 저장하기 위한 도구

/**
 * MongoDB에 세션 데이터를 저장하기 위한 저장소(Store) 생성 함수
 */
function createSessionStore() {
  // connect-mongodb-session에 express-session 객체를 전달하여 저장소 생성자를 만듦
  const MongoDbStore = mongoDbStore(expressSession);

  const store = new MongoDbStore({
    // 세션 정보가 저장될 MongoDB 주소
    uri: "mongodb://localhost:27017", 
    // 저장될 데이터베이스 이름
    databaseName: "online-shop",
    // 세션 데이터가 들어갈 컬렉션(테이블) 이름
    collection: "sessions",
  });

  return store;
}

/**
 * express-session에서 사용할 최종 설정 객체를 생성하는 함수
 */
function createSessionConfig() {
  return {
    secret: "super-secret", // 세션 ID를 암호화하기 위한 비밀 키 (임의로 설정)
    resave: false, // 세션 데이터가 바뀌지 않아도 다시 저장할지 여부
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부 (로그인 시에만 저장하도록 권장)
    store: createSessionStore(), // 위에서 만든 MongoDB 저장소를 연결
    cookie: {
      // 쿠키의 유효 기간 설정 (여기서는 2일)
      // 계산: 2일 * 24시간 * 60분 * 60초 * 1000밀리초
      maxAge: 2 * 24 * 60 * 60 * 1000, 
    },
  };
}

module.exports = createSessionConfig;