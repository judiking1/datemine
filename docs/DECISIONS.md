# datemine — Decision Log

시간이 지나도 "왜 이렇게 정했나"를 잃지 않기 위한 기록. 상대 날짜는 절대 날짜로 적는다.

## 2026-08-16 — 초기 스택 결정

### D1. 백엔드: 초기 없음 (정적 JSON), 파이프라인은 P2 로컬 내부 도구
- **결정**: MVP는 발행 데이터(Layer 2)를 **앱 번들 내 정적 JSON**으로 싣는다. 서버·DB 없음.
- **이유**: 운영비 0, 출시 속도, 그리고 Layer 1(실명 원본)이 애초에 서버에 올라가지
  않으므로 유출면이 더 작다. 수집·검수(ingest/db-raw)는 로컬 내부 도구로 P2에 붙이고,
  발행은 "정적 JSON 갱신 → 앱 업데이트/OTA"로 처리한다.
- **되돌릴 조건**: 콘텐츠 규모·개인화·서버측 검색이 필요해지면 그때 `services/api` 도입.

### D2. 앱: Expo (bare RN 아님)
- **결정**: React Native + **Expo** + TypeScript.
- **이유**: 핵심 기능(푸시 알림, 공유 카드, 매일 콘텐츠 갱신/OTA)을 Expo가 일급 지원.
  유지보수·개발속도 우위. 필요 시 `expo prebuild`로 네이티브를 열 수 있어 막히지 않음.
- **되돌릴 조건**: Expo가 지원 못 하는 네이티브 모듈이 핵심이 되면 prebuild/eject.

### D3. 모노레포·언어
- pnpm workspaces + Turborepo, TypeScript strict 전면. (변경 없음, PRODUCT/ARCHITECTURE와 동일)
