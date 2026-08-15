# datemine — Data Pipeline & Taxonomy (v0)

발행 데이터를 "빈칸 없이 · 체계적으로" 모으기 위한 설계. 손으로 카드 몇 개 넣는 게 아니라,
**모든 날짜 × 모든 카테고리를 셀 단위로 조사·추적**하는 파이프라인을 정의한다.

## 1. 커버리지 모델 (빈칸 없음 보장)

- 조사 단위 = **셀 = (날짜 or 반복 이벤트) × 위험 카테고리**.
- 각 셀은 상태를 가진다: `unsurveyed → surveyed(issue|none) → reviewed → published`.
- 목표: 모든 셀이 최소 1회 `surveyed`. 진행률 = surveyed 셀 / 전체 셀. → "얼마나 남았나" 가시화.
- 이슈 없는 셀도 "조사했고 없음"으로 기록한다(다시 안 파도 되게).

## 2. 두 축 Taxonomy (확장 가능 — 살아있는 목록)

taxonomy는 고정이 아니다. **수집 중 기존 목록에 안 맞는 위험 유형·분야를 발견하면
에이전트가 판단해 새 키를 추가하고 이 문서와 `packages/domain/src/taxonomy.ts`를 함께
갱신한다.** 데이터가 많을수록 좋다.

확장 규칙:
- 기존 키는 **이름 변경·삭제 금지**(발행 데이터가 참조하므로). 추가만 한다.
- 새 키는 목록 끝에 append. camelCase 키 + 한글 라벨.
- 추가 시 커밋 메시지에 근거를 남긴다(어떤 사례에서 필요를 느꼈는지).
- 정말 애매하면 우선 가까운 기존 카테고리로 태깅하고, 반복되면 승격한다.

### 축 A — 위험 카테고리 (무슨 종류의 지뢰인가)
날짜·시기 맥락에 걸리는 실패 유형. 카드의 1차 분류.
(정본은 `packages/domain/src/taxonomy.ts`의 `RISK_CATEGORY`. 아래는 스냅샷.)

- `history` 역사·과거사 (식민·독립·친일 등 검증)
- `politics` 정치·이념 편향
- `election` 선거·투표 언동
- `gender` 젠더·성평등
- `sexual` 성비위·성희롱
- `labor` 노동·산재·비정규
- `disaster` 재난·참사 추모(민감 — 추모일 존중)
- `religion` 종교
- `race` 인종·국적·외국인
- `minority` 장애·소수자 비하
- `animalEnv` 동물권·환경
- `food` 식문화·먹방
- `generation` 세대갈등
- `military` 병역·군대
- `class` 학력·계층·특혜
- `vice` 음주·도박·마약
- `pastScandal` 과거 논란·학폭 소환
- `privacy` 가족사·사생활
- `ip` 표절·저작권
- `ad` 허위·과장·뒷광고
- `nationalism` 국뽕·애국 마케팅 역풍
- `looseTalk` 방송·SNS 막말·실언
- `gapjil` 갑질·권력남용
- `tax` 세금·탈세
- `fraud` 사기·투자 리스크
- `regionalism` 지역감정
- `appearance` 외모·비하
- `honesty` 거짓말·도덕성
- `romance` 열애·불륜 논란

### 축 B — 분야/대상 (누구에게 해당되나)
인플루언서는 전 매체에 걸치므로 대상 페르소나로도 태깅한다. 나중에 개인화(내 분야만 보기)에 쓴다.
(정본은 `taxonomy.ts`의 `PERSONA_DOMAIN`. 아래는 스냅샷.)

- `entertainment` 연예 (배우·가수·아이돌)
- `sports` 스포츠 (선수·감독)
- `politics` 정치 (정치인·공직)
- `business` 경제 (기업인·CEO·브랜드)
- `tech` IT·테크 (개발자·스타트업)
- `media` 방송·언론
- `creator` 인플루언서·크리에이터 (유튜브·틱톡·인스타)
- `gaming` 게임·e스포츠
- `webtoon` 웹툰·웹소설
- `foodservice` 요식업·셰프
- `fashion` 패션·뷰티
- `academia` 교육·학계
- `medical` 의료·과학
- `legal` 법조
- `religionFigure` 종교인
- `artist` 문화·예술
- `general` 전방위(누구에게나)

> 카드 하나는 위험 카테고리 1개(+보조) 와 대상 페르소나 N개를 태깅한다.
> 예: 광복절 "가문 미화" → 카테고리 `history`, 대상 `general`(+`entertainment`,`politics`).

## 3. 스키마

```ts
// Layer 1 — 내부 전용(실명 O). db/raw. 절대 미발행.
interface RawCaseRecord {
  id: string;
  occurredOn: string;        // yyyy-mm-dd
  category: RiskCategory;     // 축 A
  domains: PersonaDomain[];   // 축 B
  who: string;               // 실명 (내부)
  what: string;              // 무슨 발언/행동
  consequence: string;       // 무슨 일이 벌어졌나
  sources: string[];         // 공개 보도 URL
  recurrence?: string;       // 반복 이벤트 키(예: "08-15") — 있으면 연간 반복
}

// Layer 2 — 발행(실명 X). 기존 RiskPattern/DailyContext(@datemine/domain).
// RawCaseRecord[] → 유형화·익명화 → RiskPattern(+ exampleSummary) → DailyContext.
```

## 4. 수집·발행 파이프라인 (에이전트 배치)

```
[배치 지정] 예: "8월 1~7일 × 전 카테고리" 또는 "축A=history × 전 날짜"
   → 공개 뉴스 검색 → RawCaseRecord[] 작성 (Layer 1, 실명 O, 출처 필수)
   → 유형화: 반복 패턴 추출 + 연도별 사례 병합(dedup)
   → 익명화: who 제거, exampleSummary 익명 요약
   → 사람 검수 게이트: 개인특정 가능성·낙인·사실오류 제거 → reviewedAt 부여
   → DailyContext 발행 (Layer 2, db/published or 앱 번들 JSON)
```

- **배치는 셀 단위**로 지정해 커버리지 진행률을 올린다.
- 같은 유형이 여러 해 반복 → 하나의 `RiskPattern`으로 머지, 사례는 evidence로 누적.
- 발행분은 `isPublishable`(reviewedAt 존재)만 앱에 노출.

## 5. 중복·병합 규칙
- 키: `(recurrence || occurredOn 주간) + category`. 같은 키는 한 패턴으로 병합.
- 사례가 늘어도 발행 카드는 "반복되는 유형" 하나로 유지(개별 가십 나열 금지).

## 6. 출처·신뢰도·법적
- 공개 보도된 사실만. `sources` URL 필수(2개 이상 권장).
- 실명·식별정보는 Layer 1에만. 발행은 익명. (PRODUCT.md 가드레일 / AGENTS.md 하드 규칙)
- 추측·미확인 루머 금지. 재난·참사 카테고리는 추모 톤 유지, 조롱성 카피 금지.

## 7. 진행 관리
- 커버리지 진행률(surveyed 셀 %)을 산출하는 스크립트를 둔다.
- "미조사 셀 top N"을 뽑아 다음 배치 대상으로 지정한다.

관련: `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `AGENTS.md`.
