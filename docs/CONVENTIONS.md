# datemine — Coding Conventions

원칙: **기계가 강제할 수 있는 건 도구에 맡기고, 사람이 판단할 것만 문서로 남긴다.**
포맷·기본 린트는 Biome이 자동 처리하므로 스타일 논쟁은 하지 않는다.

## 도구가 강제하는 것 (논쟁 금지)
- **포맷/린트: Biome** (`biome.json`). space 2칸, lineWidth 100, import 정렬 자동.
  - 커밋 전 `pnpm lint` 통과. 자동 수정은 `biome check --write`.
- **타입: TypeScript strict** (`tsconfig.base.json`). `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes` 등 켜져 있음. 커밋 전 `pnpm typecheck` 통과.
- **커밋: Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`).

## TypeScript 규칙
- `any` 금지 → `unknown` + 타입 가드.
- `enum` 대신 `as const` 객체 + 유니온 타입.
- 공개 도메인 타입은 `readonly` 우선 (불변 데이터 모델).
- `as` 단언 최소화 → 타입 가드/추론.
- 함수는 입력→출력이 예측 가능한 순수 함수 우선. 부작용은 경계(adapter)로.

## 네이밍
- 파일: 도메인/유틸은 `camelCase.ts`, React 컴포넌트는 `PascalCase.tsx`.
- 타입/인터페이스: `PascalCase`. 값/함수: `camelCase`. 상수: `UPPER_SNAKE`.
- 불리언은 `is/has/should` 접두. 이벤트 핸들러는 `on`/`handle` 접두.
- 축약 금지(`ctx` 정도만 허용). 도메인 용어는 PRODUCT.md 표기를 따른다.

## 구조·경계 (하드 규칙 — AGENTS.md와 동일)
- **데이터 = source of truth**, UI/알림/공유는 파생 consumer.
- core/domain(`packages/domain`)은 React Native·DB·HTTP를 import하지 않는다(순수).
- **Layer 1(실명 raw) 타입·모듈은 `apps/**`·공개 API에서 import 금지.** 발행 타입만 흐른다.
- 의존 방향: `apps → api-client → domain(published)`. 역방향·우회 import 금지.

## React Native / Expo (앱 코드)
- 함수형 컴포넌트 + Hooks만. 클래스 컴포넌트 금지.
- 리렌더 불필요한 값은 `useRef`, 비용 큰 값만 `useMemo`/`useCallback`.
- 컴포넌트는 "데이터를 받아 그린다"에 집중. 데이터 조회/가공은 domain·hook으로 분리.
- 스타일: 컴포넌트 인접 `StyleSheet.create`. 색/간격/타이포는 공유 theme 토큰으로,
  하드코딩 값 남발 금지. 다크모드 대응 값은 토큰에서 분기.
- 문자열(카피)은 한 곳(발행 데이터/문안 상수)에서 관리. 컴포넌트에 카피 하드코딩 금지.

## 테스트
- 도메인 로직은 `*.test.ts` (vitest). 순수 함수라 빠르고 결정적.
- 우선순위: (1) Layer 경계 유출 방지, (2) 매일 콘텐츠 보장, (3) 검수 게이트, (4) 날짜 계산.
- 버그 수정 시 회귀 테스트 먼저.

## 주석
- "무엇"이 아니라 "왜"를 적는다. 코드로 자명한 건 주석 금지.
- 하드 규칙(경계·미발행 등)에는 근거를 한 줄 남긴다.

관련: `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/PRODUCT.md`.
