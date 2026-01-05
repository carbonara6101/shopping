const bcrypt = require("bcryptjs"); // 비밀번호 암호화를 위한 라이브러리
const db = require("../data/database"); // 연결된 DB 인스턴스를 가져옴

class User {
  // 생성자: 컨트롤러에서 전달받은 회원 정보를 객체 내부에 저장함
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();

    if (existingUser) {
        return true;
    }
    return false;
  }

  // 실제 DB에 데이터를 넣는 비동기 함수
  async signup() {
    // 비밀번호를 그대로 저장하면 보안에 위험하므로 12단계 강도로 암호화(해싱)함
    const hashedPassword = await bcrypt.hash(this.password, 12);

    // 'users'라는 이름의 컬렉션(테이블 역할)에 데이터 한 건을 삽입함
    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword, // 암호화된 비밀번호 저장
      name: this.name,
      address: this.address,
    });
  }

  // User 클래스 내부 메서드
  hasMatchingPassword(hashedPassword) {
    // bcrypt.compare는 (평문 비밀번호, 암호화된 비밀번호)를 인자로 받아
    // 서로 일치하는지 여부를 true/false로 반환(Promise)합니다.
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
