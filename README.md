# hy-node-js-template

이 프로젝트는 TypeScript로 작성된 서비스로, HTTP, UDP, MQTT, TCP와 같은 여러 프로토콜을 통해 데이터를 수집하고 MySQL 데이터베이스에 저장.  
고객사별로 MySQL 스키마(예: client_a, client_b)를 통해 데이터를 분리.

## 주요 기능

**다중 프로토콜 지원:** HTTP (Express), UDP, MQTT, TCP를 통해 데이터 처리.  
**스키마 분리:** 고객사별 데이터 분리를 위해 MySQL 스키마 사용

## 프로젝트 구조

```
src/
├── configs/
│   └── db/Database.ts         # MySQL 연결 풀 싱글톤
├── controllers/
│   └── DataController.ts     # 스키마를 받는 비정적 컨트롤러
├── handlers/
│   ├── express.handler.ts    # Express 서버 설정
│   ├── mqtt.handler.ts       # MQTT 클라이언트 설정
│   ├── tcp.handler.ts        # TCP 서버 설정
│   └── udp.handler.ts        # UDP 서버 설정
├── queries/
│   ├── baseQuery.ts          # 공통 쿼리 처리
│   └── data.query.ts         # 테이블별 고정 쿼리
├── repositories/
│   └── DataRepository.ts     # 테이블별 데이터 작업
├── routers/
│   ├── express.router.ts     # HTTP용 Express 라우트
│   ├── mqtt.router.ts        # MQTT 메시지 라우팅
│   ├── tcp.router.ts         # TCP 데이터 라우팅
│   └── udp.router.ts         # UDP 데이터 라우팅
├── services/
│   └── DataService.ts        # 데이터 작업 비즈니스 로직
├── types/
│   └── data.type.ts          # 타입 정의
├── utils/
│   └── server-factory.ts     # 서버 초기화 유틸리티
└── scripts/
    ├── client-a.ts           # client_a 실행 파일
    └── client-b.ts           # client_b 실행 파일
```

## .env 파일 작성

```env
# Client A DB 설정
CLIENT_A_DB_HOST=localhost
CLIENT_A_DB_PORT=3306
CLIENT_A_DB_USER=root
CLIENT_A_DB_PASSWORD=password_a
CLIENT_A_DB_NAME=client_a_db
CLIENT_A_DB_CONNECTION_LIMIT=10
CLIENT_A_SCHEMA=client_a

# Client B DB 설정
CLIENT_B_DB_HOST=localhost
CLIENT_B_DB_PORT=3306
CLIENT_B_DB_USER=root
CLIENT_B_DB_PASSWORD=password_b
CLIENT_B_DB_NAME=client_b_db
CLIENT_B_DB_CONNECTION_LIMIT=10
CLIENT_B_SCHEMA=client_b
```

## MySQL 데이터베이스 설정

```sql
CREATE SCHEMA IF NOT EXISTS client_a;
CREATE TABLE client_a.sensor (
  id VARCHAR(255) PRIMARY KEY,
  value TEXT,
  timestamp VARCHAR(255),
  name VARCHAR(255)
);
CREATE SCHEMA IF NOT EXISTS client_b;
CREATE TABLE client_b.sensor (
  id VARCHAR(255) PRIMARY KEY,
  value TEXT,
  timestamp VARCHAR(255),
  name VARCHAR(255)
);
```

## 빌드 및 실행

```bash
npm install -g pm2 # pm2 없을 경우
pm2 start ecosystem.config.cjs
```

## 프로젝트의 장단점

### 장점

- 다중 프로토콜 지원으로 유연한 처리 가능
- 새로운 프로토콜이나 고객사를 추가하기 편함
- 고객사별 별도 연결 풀로 성능 병목 방지(멀티 DB).

### 단점

- .env와 JSON 파일을 함께 관리해야 하므로 설정 오류 가능성 있음.

## 회고

### 잘한 점

- 다중 프로토콜 통합하여 하나의 프로젝트에서 여러 프로토콜을 처리하도록 하여 코드 재사용성을 높임.

### 아쉬운 점

- 에러 관리에 부족한것 같음. 에러 타입별로 반환하여 상세 에러 확인하도록 해야함.
- db 의 성능 저하 우려
