# [Design] Gemma 4 Backend API Wrapper

> Version: 1.0.0 | Created: 2026-04-16 | Status: Draft

## 1. 개요 (Overview)
Gemma 4 모델을 활용한 백엔드 API 시스템 설계서입니다. Node.js/Express와 TypeScript를 기반으로 하며, 실시간 스트리밍(Chunked Transfer)을 핵심 기능으로 제공합니다.

## 2. 아키텍처 (Architecture)

### 2.1 계층 구조 (Layered Architecture)
- **Controller Layer:** HTTP 요청 수신, 요청 데이터 검증(Zod), 서비스 호출 및 응답 반환.
- **Service Layer:** 비즈니스 로직 처리, Gemma 4 프로바이더와 통신 조율.
- **Provider Layer:** 실제 Gemma 4 외부 API 또는 로컬 모델 엔진과의 연동 담당.
- **Middleware:** 로깅(Pino), 에러 핸들링, 환경 변수 관리(Dotenv).

### 2.2 시스템 다이어그램
```text
[Client] <--> [Express Controller] <--> [Gemma Service] <--> [Gemma Provider] <--> [Gemma 4 API/Model]
                      |                         |
               [Logging (Pino)]          [Validation (Zod)]
```

## 3. 데이터 모델 (Data Model)

### 3.1 요청/응답 엔티티
```typescript
// Chat 메시지 구조
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Chat 요청 스키마
interface ChatRequest {
  messages: ChatMessage[];
  stream?: boolean; // 스트리밍 여부 (기본값: false)
  temperature?: number;
}

// Generate 요청 스키마
interface GenerateRequest {
  prompt: string;
  stream?: boolean;
  max_tokens?: number;
}
```

## 4. API 명세 (API Specification)

### 4.1 Endpoints
| Method | Path | Description | Stream Support |
|--------|------|-------------|----------------|
| POST | `/api/chat` | 메시지 히스토리를 통한 대화형 인터페이스 | 지원 (Chunked) |
| POST | `/api/generate` | 단일 프롬프트를 통한 텍스트 생성 | 지원 (Chunked) |

### 4.2 스트리밍 응답 (Streaming Response)
`stream: true` 요청 시, 서버는 `Content-Type: text/event-stream` 또는 `Transfer-Encoding: chunked`를 통해 부분적인 텍스트 조각을 즉각 전송합니다.

## 5. 로깅 및 QA (Logging & QA)
- **Pino**를 활용하여 모든 API 요청/응답 이력을 구조화된 JSON으로 기록합니다.
- **Zero Script QA**를 위해 로그에 `requestId`, `latency`, `model_status` 필드를 포함합니다.

## 6. 테스트 계획 (Test Plan)

| Test Case | Expected Result |
|-----------|-----------------|
| `/api/chat` 정상 요청 (non-stream) | 200 OK와 전체 답변 JSON 반환 |
| `/api/chat` 스트리밍 요청 (stream: true) | 200 OK와 순차적인 텍스트 청크 전송 |
| `/api/generate` 정상 요청 | 200 OK와 생성된 텍스트 반환 |
| 잘못된 메시지 형식 요청 | 400 Bad Request와 Zod 에러 메시지 반환 |
| API 키 미설정 시 | 500 Internal Server Error 발생 및 에러 로그 기록 |
