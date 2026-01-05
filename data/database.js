const mongodb = require("mongodb");

// 오타 수정 (MongoClinet -> MongoClient)
const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  // 1. 클라이언트 연결
  const client = await MongoClient.connect("mongodb://localhost:27017");
  
  // 2. 중요: 연결된 client에서 db를 가져와서 'database' 변수에 저장해야 합니다.
  // 기존 코드: database.client.db("online-shop"); (X - database가 undefined인 상태에서 속성을 찾아 에러 발생)
  database = client.db("online-shop"); // (O - 올바른 표현)
}

function getDb() {
  if (!database) {
    throw new Error("You must connect first!"); // 오타 수정 (connet -> connect)
  }

  return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb
};