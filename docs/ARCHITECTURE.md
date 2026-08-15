# datemine — Architecture (v0)

`docs/PRODUCT.md`의 제품 규칙과 `AGENTS.md`의 하드 규칙을 코드 구조로 구현하는 방법.

## 설계 원칙
1. **데이터 = source of truth.** 앱·알림·공유카드는 발행 데이터(Layer 2)를 읽는 파생 뷰.
2. **2층 물리 분리.** Layer 1(실명 Raw)과 Layer 2(발행)는 타입·패키지·저장소가 갈린다.
   Layer 1 타입은 앱 패키지가 import할 수 없도록 의존 방향으로 차단한다.
3. **플랫폼 비의존 core.** 도메인 로직은 RN·DB·HTTP를 모른다. adapter가 바깥과 잇는다.

## 모노레포 구조
```
datemine/
├─ apps/
│  └─ mobile/            # React Native + TS. Layer 2만 소비. Layer 1 import 금지
├─ packages/
│  ├─ domain/            # 순수 도메인 타입·규칙 (프레임워크 비의존)
│  │   ├─ published.ts   # DailyContext 등 Layer 2 공개 타입
│  │   └─ calendar.ts    # 날짜·절기 계산 (순수 함수)
│  ├─ api-client/        # 앱↔백엔드 호출 (Layer 2 응답 타입만)
│  └─ config/            # tsconfig/eslint/biome 공유 프리셋
├─ services/
│  ├─ api/               # Hono/Nest. 공개 API = Layer 2 only
│  └─ ingest/            # 수집 파이프라인. Layer 1(실명) 다루는 유일한 곳
│      # RawCaseRecord → 유형화 → 실명제거 → 검수 → Layer 2 발행
├─ db/
│  ├─ published/         # Layer 2 스키마·마이그레이션 (앱이 읽음)
│  └─ raw/               # Layer 1 스키마. 내부 전용, 접근통제, 앱에서 접근 불가
├─ docs/
└─ AGENTS.md
```

**의존 방향 (컴파일 경계로 강제):**
```
apps/mobile → packages/api-client → packages/domain(published)   ✅
services/ingest → db/raw (Layer 1)                               ✅ (여기서만)
apps/**, packages/api-client → db/raw / RawCaseRecord            ❌ 금지
```
`db/raw`와 `RawCaseRecord` 타입은 `services/ingest`·`db/raw` 밖에서 import 불가.
tsconfig project references + lint 규칙(no-restricted-imports)으로 막는다.

## 도메인 타입 (packages/domain)
```ts
// published.ts — 사용자에게 나가는 유일한 형태 (실명 없음)
export type DayType =
  | "holiday" | "memorial" | "anniversary" | "election" | "solarTerm" | "ordinary";

export interface RiskPattern {
  pattern: string;         // 반복되는 실패 유형
  whyItBackfires: string;  // 왜 문제가 되는가
  exampleSummary: string;  // 실명 제거된 사례 요약
  severity: 1 | 2 | 3;
}

export interface DailyContext {
  date: string;            // ISO yyyy-mm-dd (양력)
  lunar?: string;
  dayType: DayType;
  significance: string;    // 이 날의 의미(교육적)
  riskPatterns: RiskPattern[];
  advice: string;          // 오늘의 자제 카피(세게)
  reviewedAt: string;      // 검수 게이트 통과 시각 (없으면 미발행)
}
```
```ts
// services/ingest 내부 전용 — 절대 export/발행 안 됨
interface RawCaseRecord {
  date: string;
  who: string;             // 실명 (내부 전용)
  what: string;
  consequence: string;
  sources: string[];       // 출처 URL
}
```

## 매일 콘텐츠 보장 (calendar.ts)
- `resolveDay(date)` → 공휴일/기념일/추모일/선거/절기 순으로 매칭.
- 매칭이 없으면 **가장 가까운 절기**(초복·중복·하지·입춘 등)를 dayType=solarTerm으로 부여.
- 어떤 날도 `DailyContext` 없이 비지 않는다. 빈 날 = 버그.

## 수집→발행 파이프라인 (services/ingest)
```
뉴스 검색 → RawCaseRecord[] (Layer 1, 실명 O, db/raw)
   → 유형화(LLM): 반복 패턴 추출
   → 실명·식별정보 제거 + 사례 익명 요약
   → 사람 검수 게이트 (reviewedAt 부여)
   → DailyContext.riskPatterns (Layer 2, db/published) 발행
```
검수 통과(`reviewedAt` 존재) 전에는 앱에 노출되지 않는다.

## 앱 (apps/mobile)
- 오늘 날짜로 `DailyContext` 조회 → 카드 렌더.
- 아침 푸시 알림(Expo Notifications 등).
- 공유 카드 생성(실명 없는 발행 문구만).
- Layer 1·RawCaseRecord·db/raw는 import 자체가 불가(경계 규칙).

## 테스트 우선순위
1. **경계 유출 방지**: Layer 1 타입/모듈이 앱·public API로 새지 않는지 (컴파일·lint 테스트).
2. **매일 콘텐츠**: 임의 날짜 1년치에 대해 `resolveDay`가 항상 비어있지 않은지.
3. **검수 게이트**: `reviewedAt` 없는 콘텐츠가 발행 응답에 포함되지 않는지.
4. 절기·음력 날짜 계산 정확성.
