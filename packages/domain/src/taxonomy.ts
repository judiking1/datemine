/**
 * Two-axis taxonomy for tagging risk content. See docs/DATA-PIPELINE.md.
 * Axis A = risk category (what kind of landmine). Axis B = persona domain (who it applies to).
 * `as const` objects (not enums) per docs/CONVENTIONS.md.
 */

export const RISK_CATEGORY = {
  history: "역사·과거사",
  politics: "정치·이념 편향",
  election: "선거·투표",
  gender: "젠더·성평등",
  sexual: "성비위·성희롱",
  labor: "노동·산재·비정규",
  disaster: "재난·참사 추모",
  religion: "종교",
  race: "인종·국적·외국인",
  minority: "장애·소수자",
  animalEnv: "동물권·환경",
  food: "식문화·먹방",
  generation: "세대갈등",
  military: "병역·군대",
  class: "학력·계층·특혜",
  vice: "음주·도박·마약",
  pastScandal: "과거 논란·학폭 소환",
  privacy: "가족사·사생활",
  ip: "표절·저작권",
  ad: "허위·과장·뒷광고",
  nationalism: "국뽕·애국 마케팅",
  looseTalk: "막말·실언",
} as const;

export type RiskCategory = keyof typeof RISK_CATEGORY;

export const PERSONA_DOMAIN = {
  entertainment: "연예",
  sports: "스포츠",
  politics: "정치",
  business: "경제",
  tech: "IT·테크",
  media: "방송·언론",
  creator: "인플루언서·크리에이터",
  general: "전방위",
} as const;

export type PersonaDomain = keyof typeof PERSONA_DOMAIN;

export function riskCategoryLabel(category: RiskCategory): string {
  return RISK_CATEGORY[category];
}

export function personaDomainLabel(domain: PersonaDomain): string {
  return PERSONA_DOMAIN[domain];
}
