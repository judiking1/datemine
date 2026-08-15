# Candidate Calendar (Phase 1 — 후보 달력)

날짜별 "매년 반복 논란" 타깃 목록. **실명·출처 없음**(익명 패턴 한 줄만) → 커밋 가능.
Phase 2 수집 에이전트가 이 목록의 우선순위 셀만 채운다. 발행 데이터가 아니라 **조사 계획**이다.

## 파일
- `q1.json` (1–3월), `q2.json` (4–6월), `q3.json` (7–9월), `q4.json` (10–12월)
- 각 파일은 아래 `Candidate[]` 배열.

## Candidate 형식
```jsonc
{
  "dateKey": "10-09",        // "MM-DD" (고정일) 또는 음력키 "lunar:seollal"
  "eventName": "한글날",
  "dayType": "holiday",      // holiday|memorial|anniversary|solarTerm|ordinary
  "category": "nationalism", // packages/domain/src/taxonomy.ts 의 RISK_CATEGORY 키만
  "recurrencePattern": "매년 반복되는 논란 유형 한 줄 (익명, 개인 특정 불가)",
  "severity": 3,             // 1~3
  "domains": ["business","media"], // PERSONA_DOMAIN 키
  "seasonal": false,         // true면 정확한 날짜가 아니라 시기(주간) 창
  "alreadyPublished": false  // seed.ts에 이미 발행된 셀이면 true
}
```

## 규칙
- 공개 보도에서 **반복** 논란만. 개별 가십 1건 금지.
- 실명·기관 특정·출처 URL을 이 파일에 남기지 않는다(Phase 2의 `data/raw/` 소관).
- ordinary(반복 논란 없는 평범한 날)는 목록에 넣지 않는다 — 고신호 날만.
