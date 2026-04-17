# Gemma 4 Backend API Wrapper

Gemma 4 모델을 활용한 견고하고 확장 가능한 Node.js/TypeScript 백엔드 API 서비스입니다. 실시간 스트리밍 응답과 구조화된 로깅을 통해 안정적인 AI 서비스 개발 기반을 제공합니다.

## 🚀 주요 기능

- **TypeScript 기반:** 엄격한 타입 체크와 최신 ESNext 문법 및 ESM 환경 사용.
- **RESTful API:** `/api/chat`, `/api/generate` 엔드포인트를 통한 대화 및 텍스트 생성.
- **실시간 스트리밍:** HTTP Chunked Transfer Encoding을 활용하여 모델의 응답을 조각(Chunk) 단위로 실시간 전송.
- **데이터 유효성 검증:** Zod 스키마를 사용하여 런타임 요청 데이터의 무결성 보장.
- **구조화된 로깅:** Pino를 이용한 JSON 포맷 로깅으로 Zero Script QA 및 모니터링 최적화.
- **자동화된 테스트:** Jest와 Supertest를 활용한 통합 테스트 환경 구축 (ESM 대응).

## 🛠 기술 스택

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Language:** TypeScript (v5.4+)
- **Model Engine:** Ollama (Gemma 4 모델 기반)
- **Validation:** Zod
- **Logging:** Pino & Pino-pretty
- **Testing:** Jest, Supertest, ts-jest

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
루트 디렉토리에 `.env` 파일을 생성하고 필요한 설정을 추가합니다. (기본값 사용 시 생략 가능)
```env
PORT=3000
OLLAMA_MODEL=gemma
```

### 3. 개발 모드 실행 (Nodemon)
```bash
npm run dev
```

### 4. 빌드 및 프로덕션 실행
```bash
npm run build
npm start
```

## 🧪 테스트 실행
Jest를 활용한 통합 테스트를 실행합니다. (ESM VM 모듈 활성화)
```bash
npm test
```

## 📖 API 명세

### 1. Chat API (`POST /api/chat`)
메시지 히스토리를 기반으로 AI와 대화합니다.
- **Request Body:**
  - `messages`: `Array<{ role: 'user' | 'assistant' | 'system', content: string }>` (필수)
  - `stream`: `boolean` (선택, 기본값: false)
  - `temperature`: `number` (선택, 0~2 사이)

### 2. Generate API (`POST /api/generate`)
단일 프롬프트를 통해 텍스트를 생성합니다.
- **Request Body:**
  - `prompt`: `string` (필수)
  - `stream`: `boolean` (선택, 기본값: false)

### 3. Health Check (`GET /health`)
서버와 모델의 상태를 확인합니다.

---
**Created by CrazyKrKim (rlatjd789@naver.com)**
