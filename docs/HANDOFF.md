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

## 다음 할 일 (우선순위)

1. **대량 배치 수집** — `docs/COLLECTION-PLAYBOOK.md`의 절차/프롬프트대로 셀 단위 진행.
   후보 시즌: 5월 가정의달, 선거일, 한글날(10/9), 빼빼로데이(11/11), 연말·크리스마스,
   밸런타인/화이트데이, 참사 추모일(4/16 등, 추모 톤 엄수).
2. **커버리지 진행률 CLI** — ingest의 coverage 모델로 "몇 % 조사됨" 산출(미구현).
3. **발행 데이터 분리** — seed.ts가 커지면 `apps/mobile/src/data/published/`로 분할.
4. **소유자 검수** — 기존 초안 카드 톤·사실 확인 후 확정.

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
