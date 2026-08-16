# Draft Cards (Phase 2 스테이징 — 검수 대기)

Phase 2 수집 에이전트가 만든 **익명 발행 초안**. 앱은 이 폴더를 **읽지 않는다**(= 미검수 노출 0).
소유자 검수 후 `apps/mobile/src/data/seed.ts`로 승격될 때 비로소 앱에 뜬다.

## 파이프라인 위치
```
data/raw/*.raw.json   (Layer 1, 실명·출처, gitignore·커밋금지)
      │  toRiskPattern 익명화 (실명 유출 시 throw)
      ▼
data/drafts/*.json    (Layer 2 초안, reviewedAt 없음 — 여기)
      │  소유자 검수: 톤·사실·개인특정 확인 → reviewedAt 부여
      ▼
apps/mobile/src/data/seed.ts  (발행·검수분, 앱이 읽음)
```

## Draft 파일 형식 (`<dateKey>.json`)
`dateKey`는 `MM-DD`(고정일) 또는 `lunar-<key>`(음력). 파일명 예: `04-16.json`, `lunar-buddha.json`.
```jsonc
{
  "key": "04-16",            // seed 승격 시 사용할 키. 음력은 "lunar:<key>"
  "mergeInto": false,        // true면 해당 key에 이미 카드가 있어 riskPatterns만 추가(append)
  "card": {
    "dayType": "memorial",   // holiday|memorial|anniversary|election|solarTerm|ordinary
    "significance": "…",
    "advice": "…",
    "riskPatterns": [
      {
        "pattern": "…",            // 반복 유형 (익명)
        "whyItBackfires": "…",
        "exampleSummary": "…",     // 개인 특정 불가 요약
        "severity": 3,             // 1|2|3
        "category": "disaster",    // RISK_CATEGORY 키
        "domains": ["business","media"]  // PERSONA_DOMAIN 키
      }
    ]
    // reviewedAt 없음 — 검수 후 소유자가 부여
  },
  "reviewNotes": "톤·근거·주의점 (검수자용, 실명 금지)"
}
```

## 하드 규칙
- `card` 안에 **실명·기관 특정·출처 URL 금지**. 실명·출처는 `data/raw/`에만.
- `reviewedAt`는 에이전트가 넣지 않는다. 검수자만 부여.
- 재난·참사·추모(disaster/memorial/history 추모일)는 **추모 톤 엄수, 조롱 금지**. 겨누는 건
  비극이 아니라 "그 날 무신경하게 굴다 역풍 맞는 마케팅·발언 유형".

## 승격 (검수자)
초안 확인 → `card`에 `reviewedAt` 추가 → `seed.ts`의 `seedCardsByMonthDay`(또는
`seedCardsByLunarKey`)에 넣음(`mergeInto`면 기존 riskPatterns에 append) → 초안 파일 삭제 → 커밋.
