import type { Severity } from "@datemine/domain";

/**
 * "그날의 뇌관" — this-day-in-history, datemine-flavored. Widely-known, public-record events
 * whose anniversary makes a topic sensitive today. Event-level facts only (no defamation of
 * private individuals); tragedies stay respectful. Keyed by "MM-DD"; one is shown per day.
 */
export type OnThisDay = {
  readonly year: number;
  readonly event: string;
  readonly caution: string;
  readonly level: Severity;
};

export const ON_THIS_DAY: Readonly<Record<string, readonly OnThisDay[]>> = {
  "01-27": [
    {
      year: 1945,
      event: "아우슈비츠 해방 (국제 홀로코스트 추모의 날)",
      caution: "학살·혐오를 밈·비유로 소비하면 즉시 역풍.",
      level: 3,
    },
  ],
  "02-18": [
    {
      year: 2003,
      event: "대구 지하철 참사",
      caution: "대형 인명참사 기일. 재난을 소재·판촉에 쓰지 마라.",
      level: 3,
    },
  ],
  "02-24": [
    {
      year: 2022,
      event: "러시아의 우크라이나 침공",
      caution: "전쟁을 가벼운 드립·마케팅으로 다루면 반발.",
      level: 2,
    },
  ],
  "03-11": [
    {
      year: 2011,
      event: "동일본 대지진·후쿠시마 원전 사고",
      caution: "방사능·일본 관련 소비를 무신경하게 밀면 뇌관.",
      level: 2,
    },
  ],
  "03-15": [
    {
      year: 1960,
      event: "3·15 부정선거",
      caution: "선거 공정성은 상시 예민. 부정선거 소재화 조심.",
      level: 2,
    },
  ],
  "03-26": [
    {
      year: 2010,
      event: "천안함 피격",
      caution: "안보·희생을 밈·판촉으로 소비하면 공분.",
      level: 3,
    },
  ],
  "04-16": [
    {
      year: 2014,
      event: "세월호 참사",
      caution: "추모 정서 최고조. 할인·이벤트·농담 전면 자제.",
      level: 3,
    },
  ],
  "04-19": [
    { year: 1960, event: "4·19 혁명", caution: "민주항쟁을 정략·재치로 소비하면 역풍.", level: 2 },
  ],
  "04-26": [
    {
      year: 1986,
      event: "체르노빌 원전 사고",
      caution: "핵·재난을 자극적 소재로 쓰면 반감.",
      level: 2,
    },
  ],
  "04-29": [
    {
      year: 1932,
      event: "윤봉길 의거",
      caution: "항일 서사가 강한 시기, 일본풍 무신경 사용 조심.",
      level: 2,
    },
  ],
  "05-16": [
    {
      year: 1961,
      event: "5·16 군사정변",
      caution: "쿠데타·군사정권 해석은 진영 뇌관. 편승 금지.",
      level: 2,
    },
  ],
  "05-18": [
    {
      year: 1980,
      event: "5·18 광주민주화운동",
      caution: "진압 연상 표현·폄훼 밈은 처벌·불매 직행.",
      level: 3,
    },
  ],
  "06-06": [
    {
      year: 1956,
      event: "현충일 제정 (순국선열 추모)",
      caution: "추모일 축제·할인 톤은 곧바로 역풍.",
      level: 2,
    },
  ],
  "06-25": [
    {
      year: 1950,
      event: "6·25 전쟁 발발",
      caution: "전쟁·참전을 유희·말장난으로 소비하면 공분.",
      level: 2,
    },
  ],
  "06-29": [
    {
      year: 1995,
      event: "삼풍백화점 붕괴",
      caution: "부실·참사 기일. 안전을 비용으로 다루면 뇌관.",
      level: 3,
    },
  ],
  "06-30": [
    {
      year: 1999,
      event: "씨랜드 청소년수련원 화재",
      caution: "아동 참사 기일. 안전 경시 콘텐츠 조심.",
      level: 3,
    },
  ],
  "07-17": [
    {
      year: 1948,
      event: "제헌절 (헌법 공포)",
      caution: "개헌·헌정 이념을 정쟁 도구로 쓰면 양쪽서 역풍.",
      level: 1,
    },
  ],
  "08-15": [
    {
      year: 1945,
      event: "광복절",
      caution: "가문 미화·일본풍 마케팅이 검증대에 오른다.",
      level: 2,
    },
  ],
  "08-18": [
    {
      year: 1976,
      event: "판문점 도끼 만행",
      caution: "안보·대북 소재는 상시 진영 뇌관.",
      level: 1,
    },
  ],
  "08-29": [
    {
      year: 1910,
      event: "경술국치 (국권 피탈)",
      caution: "국치일 인지 없이 일본풍·경축 톤이면 역풍.",
      level: 2,
    },
  ],
  "09-01": [
    {
      year: 1983,
      event: "대한항공 007편 격추",
      caution: "민간기 참사·냉전 비극을 가볍게 다루지 마라.",
      level: 2,
    },
  ],
  "09-11": [
    {
      year: 2001,
      event: "9·11 테러",
      caution: "테러·대량 인명피해를 밈으로 쓰면 국제적 역풍.",
      level: 2,
    },
  ],
  "10-09": [
    {
      year: 1446,
      event: "훈민정음 반포 (한글날)",
      caution: "한글날에 외국어 떡칠 카피는 자기모순.",
      level: 1,
    },
  ],
  "10-16": [
    { year: 1979, event: "부마민주항쟁", caution: "민주화 역사 폄훼·왜곡은 상시 뇌관.", level: 1 },
  ],
  "10-21": [
    {
      year: 1994,
      event: "성수대교 붕괴",
      caution: "부실·참사 기일. 안전 경시 소재화 조심.",
      level: 3,
    },
  ],
  "10-26": [
    {
      year: 1979,
      event: "10·26 (박정희 대통령 피격) · 안중근 의거(1909)",
      caution: "정치·역사 해석이 첨예. 편향 편승 조심.",
      level: 2,
    },
  ],
  "10-29": [
    {
      year: 2022,
      event: "이태원 참사",
      caution: "인파·축제 마케팅이 추모 감수성과 충돌.",
      level: 3,
    },
  ],
  "11-13": [
    {
      year: 1970,
      event: "전태일 열사 분신",
      caution: "노동·산재 감수성 최고조. 노동 경시 발언 조심.",
      level: 2,
    },
  ],
  "11-17": [
    {
      year: 1905,
      event: "을사늑약 (순국선열의 날)",
      caution: "국권 상실 역사, 일본풍 무신경 사용 뇌관.",
      level: 2,
    },
  ],
  "11-23": [
    {
      year: 2010,
      event: "연평도 포격",
      caution: "안보·희생을 소재·판촉으로 소비하면 공분.",
      level: 2,
    },
  ],
  "11-29": [
    {
      year: 1987,
      event: "KAL 858편 폭파",
      caution: "테러·참사 비극을 가볍게 다루지 마라.",
      level: 2,
    },
  ],
  "12-12": [
    {
      year: 1979,
      event: "12·12 군사반란",
      caution: "쿠데타 미화·폄훼는 진영 뇌관. 편승 금지.",
      level: 2,
    },
  ],
  "12-25": [
    {
      year: 1971,
      event: "대연각호텔 화재 · 성탄절",
      caution: "성탄 상업화·종교 편향, 참사 기일 겹침 유의.",
      level: 1,
    },
  ],
  "01-22": [
    {
      year: 2010,
      event: "국내 첫 대형 구제역 확산기",
      caution: "가축 살처분·먹거리 감수성. 자극적 소비 조심.",
      level: 1,
    },
  ],
  "03-22": [
    {
      year: 1993,
      event: "세계 물의 날 첫 지정",
      caution: "물 관련 그린워싱은 하루 생색으로 들통난다.",
      level: 1,
    },
  ],
  "05-08": [
    {
      year: 1973,
      event: "어버이날 제정",
      caution: "'정상가족' 프레임은 누군가를 지운다.",
      level: 1,
    },
  ],
  "09-10": [
    {
      year: 2003,
      event: "세계 자살예방의 날",
      caution: "자살을 자극·미화·희화화하면 모방 위험. 존중 우선.",
      level: 3,
    },
  ],
  "07-27": [
    {
      year: 1953,
      event: "6·25 정전협정",
      caution: "전쟁·분단을 가벼운 소재로 쓰면 역풍.",
      level: 1,
    },
  ],
  "04-03": [
    {
      year: 1948,
      event: "제주 4·3",
      caution: "왜곡·색깔론·조롱은 처벌·비판 직행. 추모 톤.",
      level: 2,
    },
  ],
  "08-14": [
    {
      year: 2018,
      event: "위안부 피해자 기림의 날 (국가기념일)",
      caution: "피해 역사를 굿즈·농담으로 다루면 2차 가해.",
      level: 3,
    },
  ],
};
