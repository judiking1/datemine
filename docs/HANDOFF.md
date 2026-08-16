# datemine — HANDOFF (새 세션 최우선 필독)

> Updated 2026-08-16. 새 세션은 이 문서를 먼저 읽고, 이어서 AGENTS.md 필독 순서를 따른다.

## 지금까지 (완료)

- **문서 세트**: PRODUCT / ARCHITECTURE / DECISIONS / CONVENTIONS / DATA-PIPELINE /
  COLLECTION-PLAYBOOK / AGENTS. 제품·톤·법적 가드레일·스택·수집 절차가 모두 문서화됨.
- **모노레포**: pnpm + Turborepo + TS strict. `.npmrc`는 `node-linker=hoisted`(Expo용).
- **`packages/domain`**: 발행 타입(DailyContext/RiskPattern), 검수 게이트(isPublishable),
  달력 resolver(고정일 + **음력 명절** + 절기 + ordinary 폴백), 2축 taxonomy. 테스트 7 통과.
- **`services/ingest`**(내부 전용): RawCaseRecord(Layer 1, 실명), toRiskPattern 익명화기
  (실명 유출 시 throw), 커버리지 모델(셀 = 날짜×카테고리). 테스트 5 통과.
- **`apps/mobile`**: Expo(SDK 52) + RN. 오늘 카드 화면. 웹으로 렌더 확인 완료.
- **경계 4중 방어**: 의존구조 / `check:boundaries` 스크립트 / 런타임 throw / .gitignore.
- **pre-commit 훅**(`.githooks`): boundary → typecheck → lint → test. `core.hooksPath` 설정됨.
  (새 클론에서 한 번 `git config core.hooksPath .githooks` 필요.)

## 발행된 카드 (초안 — 소유자 검수 대기)

3/1 삼일절(nationalism), 4/1 만우절(ad), 6/6 현충일(disaster), 8/15 광복절(history+
nationalism), 7/17 초복(food), 설날·추석 명절(gender+generation, lunarKey 매칭).
→ 위치: `apps/mobile/src/data/seed.ts`. **모두 익명·패턴 수준, 실명 없음.**

## Phase 1 완료 — 후보 달력 (2026-08-16)

`data/candidates/q1~q4.json` — 4분기 스윕으로 **고신호 46셀**(날짜×카테고리) 익명 목록화.
실명·출처 없음(커밋됨). Phase 2 셀 채우기의 우선순위 소스. sev3 미발행 셀:
- Q1: 삼일절 history, 새내기 음주강요(vice, seasonal)
- Q2: 세월호 4/16(disaster), 광주 5/18(history) — 추모/역사 톤 엄수
- Q3: 위안부 기림의날 8/14(history)
- Q4: 핼러윈 10/31(disaster, 참사 추모 감수성)
검수 메모: 스승의날→`class` 임시매핑(촌지 카테고리 부재). 신규 taxonomy 검토 여지.

## UI 상태 (2026-08-16)
오늘 카드(심각도/카테고리 칩·요일·엠프티) → **레퍼런스 목록**(`ReferenceList`/`upcoming.ts`,
발행 카드 연표) → 면책 푸터. `.claude/launch.json`의 `mobile-web`로 프리뷰.

## Phase 2 파이프라인 (구축됨, 2026-08-16)
- **스테이징**: `data/drafts/*.json`(앱 미연결) → 검수 → `seed.ts` 승격. `data/drafts/README.md`.
- **검증 게이트**: `pnpm check:drafts`(스키마·taxonomy·`reviewedAt` 금지·URL유출) → pre-commit 포함.
- **진행률**: `pnpm progress`(후보 대비 초안·발행 %, 검수 대기 목록).
- **검수 페이지**: `node scripts/review-drafts.mjs` → `review-drafts.html`(gitignore). 카드+메모 렌더.
- **초안 28일치 커밋됨**(검수 대기): 후보 37일 중 75.7%. sev3/추모/정치/상업/시즌 전 카테고리 커버.
- **UI**: 카테고리 그룹 카드 + 종합충고 + 레퍼런스 목록 + 날짜 네비(이전/다음·오늘·탭점프).

## ⚠️ 소유자 검수 대기 (승격 = 앱 노출)
`data/drafts/`의 초안을 톤·사실·개인특정 확인 후 `reviewedAt` 부여 → `seed.ts`로 이동 → 초안 삭제.
승격 시 주의(초안 reviewNotes에 상세):
- **05-18, 04-16, 08-14, 10-31**: `seedCalendar.fixedEvents`에 memorial 항목 신규 추가 필요(현재 미등재).
- **03-01**: 기존 카드에 history 패턴 append(mergeInto), significance/advice 병합.
- **03-02**: seasonal(고정일 아님) — 시즌 노출 방식 검토.
- **스승의날→class 임시매핑**(촌지 카테고리 부재): 신규 taxonomy(`bribery` 등) 검토 여지.

## 남은 백로그
1. **정치·추모 sev2 셀 수집** — 제주4·3, 4·19, 6·10, 6·25, 개천절 등(민감, 방향 확인 후).
2. **발행 데이터 분리** — seed.ts가 커지면 `apps/mobile/src/data/published/`로 분할.
3. **UI 추가** — 폰 프리뷰 대응, 공유카드, 날짜 네비게이션.

## 수집 시 반드시 (하드 규칙 — AGENTS.md 4장)

- 실명 사례는 `data/raw/`(gitignore)에만. **커밋 금지.** 발행은 익명 패턴만.
- 톤은 세게, 대상은 사람이 아니라 반복 유형.
- 새 카테고리·분야 필요하면 `taxonomy.ts`에 append(삭제·개명 금지) + 커밋 근거.
- 재난·참사(disaster)는 추모 톤, 조롱성 금지.

## 실행·검증

```
pnpm install
pnpm --filter @datemine/domain test        # 도메인 로직
pnpm --filter @datemine/mobile web          # 앱 웹 프리뷰(localhost)
pnpm check:boundaries                        # Layer 1 유출 검사
pnpm typecheck && pnpm lint && pnpm test     # 전체 게이트 (훅과 동일)
```

앱에서 특정 날짜 카드 미리보기: `apps/mobile/App.tsx`의 today를 임시로 `"2026-09-25"`
등으로 바꿔 확인(확인 후 `toIsoDate(new Date())`로 원복).

## 열린 백로그
- **음력은 연도별 테이블**(`lunarHolidaysByYear`)로 수동 관리. 2026만 채워짐 → 다년치 추가 필요.
- 절기도 2026만 시드됨.
- 챗봇(P3), 검색 UI, 알림, 공유카드 미구현.
