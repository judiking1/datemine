# datemine — Collection Playbook

에이전트가 배치 단위로 데이터를 수집·발행하는 표준 절차. `docs/DATA-PIPELINE.md`의 구현판.

## 배치 지정
- 단위: 셀 = (dateKey × category). 한 배치는 한 시기/카테고리 묶음.
- 예: "8월 상순 × history/politics", "현충일(06-06) × 전 카테고리".

## 절차 (각 배치)

1. **검색** — 공개 보도만. 해당 시기·주제에서 **반복적으로** 논란이 된 유형을 찾는다.
   개별 가십 1건이 아니라 "매년/반복 터지는 패턴"을 본다.
2. **원본 기록 (Layer 1, 내부 전용)** — `data/raw/`(gitignore됨)에 `RawCaseRecord`로
   적는다. 실명·출처 포함. **이 파일은 절대 커밋하지 않는다.**
3. **유형화·병합** — 같은 (recurrence|주간)+category는 하나의 패턴으로 병합.
4. **익명화** — `@datemine/ingest`의 `toRiskPattern()`로 변환. 실명이 발행 텍스트에
   남으면 함수가 throw한다. `exampleSummary`는 개인 특정 불가하게 요약.
5. **검수 게이트 (사람)** — 개인 추정 가능성·낙인·사실오류 확인. 통과 시 `reviewedAt` 부여.
   **검수 전에는 `reviewedAt`를 넣지 않는다** (앱에 노출 안 됨).
6. **발행** — 익명 `DailyContext`를 published 데이터(`apps/mobile/src/data/published/`)에
   추가. 이 발행분만 커밋한다.

## 톤 규칙 (발행 카피)
- 직설적·자극적으로 (제품 정체성). 단 개인 저격 금지, 패턴을 겨눈다.
- 재난·참사(disaster)는 추모 톤 유지, 조롱성 금지.

## 커밋 규칙
- 커밋 대상 = **익명 발행 데이터뿐**. `data/raw/`·실명·출처 원본은 커밋 금지.
- `pre-commit` 훅이 boundary/typecheck/lint/test를 강제한다.
- 새 카테고리·분야가 필요하면 taxonomy에 append (AGENTS.md 살아있는 taxonomy 규칙).

## 배치 지시 프롬프트 템플릿
```
배치: <dateKey 목록> × <category 목록>
1) 공개 보도 검색으로 이 시기 반복 논란 유형을 찾아라.
2) 실명 사례는 data/raw/ 에만 (커밋 금지).
3) toRiskPattern으로 익명화, 검수 후 reviewedAt 부여.
4) apps/mobile/src/data/published/ 에 DailyContext 추가하고 발행분만 커밋.
5) 필요한 새 taxonomy 키는 append 후 근거를 커밋 메시지에 남겨라.
```
