import type { RiskPattern } from "@datemine/domain";

/**
 * "상시 지뢰" — evergreen, date-independent landmines. Most PR blowups aren't tied to a
 * calendar day; these categories detonate any day of the year. One is surfaced on
 * event-free days (see fortune.ts / getToday) so the app reflects that risk is constant.
 * General wisdom in the datemine voice — not a specific incident.
 */
export const EVERGREEN: readonly RiskPattern[] = [
  {
    pattern: "성별을 싸잡아 일반화하거나 성역할을 당연시하는 발언",
    whyItBackfires:
      "젠더는 시기 불문 가장 예민한 뇌관이다. '남자/여자는 원래' 한마디가 통계·맥락 없이 나오면 즉시 캡처돼 확산된다.",
    exampleSummary: "특정 날이 아니어도, 성별 일반화 발언은 사시사철 논란과 사과로 이어진다.",
    severity: 3,
    category: "gender",
    domains: ["general", "media", "creator"],
  },
  {
    pattern: "협찬·대가를 받고도 '내돈내산'처럼 보이게 하는 콘텐츠",
    whyItBackfires:
      "표시광고법상 대가성 표기는 의무다. '광고' 두 글자를 숨기면 신뢰가 무너지고 제재·환불 요구로 번진다.",
    exampleSummary: "뒷광고는 특정 시즌이 아니라, 표기 하나 빠질 때마다 상시 터진다.",
    severity: 3,
    category: "ad",
    domains: ["creator", "business", "media"],
  },
  {
    pattern: "지위·권력으로 아랫사람을 함부로 대하는 갑질 언행",
    whyItBackfires:
      "녹취·CCTV·메신저가 일상이라 갑질은 반드시 증거로 남는다. 한 장면이 조직 전체의 평판을 무너뜨린다.",
    exampleSummary: "갑질 논란은 달력과 무관하게, 태도 하나가 박제되는 순간 터진다.",
    severity: 3,
    category: "gapjil",
    domains: ["business", "foodservice", "general"],
  },
  {
    pattern: "과거 발언·행적이 지금의 기준으로 다시 소환되는 상황",
    whyItBackfires:
      "인터넷에 올라온 건 사라지지 않는다. 유명해질수록 옛 게시물·발언이 역으로 검증대에 오른다.",
    exampleSummary: "과거 소환은 특정일이 아니라, 주목받는 순간 언제든 시작된다.",
    severity: 2,
    category: "pastScandal",
    domains: ["entertainment", "creator", "politics"],
  },
  {
    pattern: "장애·질환·정신건강을 비유나 조롱 표현으로 가볍게 쓰기",
    whyItBackfires:
      "'절름발이·꿀 먹은 벙어리' 같은 관용 표현도 이제 차별로 읽힌다. 무심코 쓴 비유가 사과문이 된다.",
    exampleSummary: "소수자 비하 표현은 시기 불문, 쓰는 순간이 곧 논란의 시작이다.",
    severity: 2,
    category: "minority",
    domains: ["politics", "media", "general"],
  },
  {
    pattern: "특정 지역·출신을 싸잡아 비하하거나 편견을 재생산하는 말",
    whyItBackfires:
      "지역감정은 항상 활성 상태다. 농담·밈으로 소비해도 해당 지역 전체를 적으로 돌린다.",
    exampleSummary: "지역 비하는 날을 가리지 않고, 한마디에 광범위한 반발을 부른다.",
    severity: 2,
    category: "regionalism",
    domains: ["general", "media", "creator"],
  },
  {
    pattern: "역사·과거사를 안이하게 표현하거나 왜곡·미화하는 발언",
    whyItBackfires:
      "역사 감수성은 상시 높다. 가벼운 표현 하나가 '역사 인식 부재'의 증거로 확대 해석된다.",
    exampleSummary: "역사 관련 실언은 국경일이 아니어도, 표현 하나로 언제든 번진다.",
    severity: 3,
    category: "history",
    domains: ["politics", "entertainment", "media"],
  },
  {
    pattern: "특정 종교를 기본값으로 전제하거나 신앙을 조롱하는 표현",
    whyItBackfires:
      "다종교 사회에서 한 종교 전제·비하는 형평성 시비를 부른다. 상징을 가벼이 쓰면 신성모독 논란이 된다.",
    exampleSummary: "종교 관련 무신경함은 시기와 무관하게 반발을 부른다.",
    severity: 2,
    category: "religion",
    domains: ["business", "media", "general"],
  },
  {
    pattern: "인종·국적·외국인을 희화화하거나 고정관념으로 그리는 콘텐츠",
    whyItBackfires:
      "글로벌 시청자가 실시간으로 본다. 블랙페이스·억양 흉내 같은 재현은 국내외 동시에 역풍을 맞는다.",
    exampleSummary: "인종 비하 논란은 특정일이 아니라, 재현되는 순간 곧바로 확산된다.",
    severity: 3,
    category: "race",
    domains: ["entertainment", "media", "creator"],
  },
  {
    pattern: "세대를 '틀딱·MZ' 식으로 싸잡아 조롱하거나 대립을 부추기는 말",
    whyItBackfires:
      "세대 조롱은 양쪽 모두를 자극한다. 웃음 소재로 써도 당사자 세대엔 혐오로 읽힌다.",
    exampleSummary: "세대 갈등 조장은 날짜와 무관하게 상시 반발을 부른다.",
    severity: 2,
    category: "generation",
    domains: ["media", "creator", "general"],
  },
  {
    pattern: "노동자·필수노동을 하대하거나 안전을 비용으로만 보는 언행",
    whyItBackfires:
      "산재·과로 감수성이 높아졌다. '아무나 하는 일' 식 발언이나 안전 경시는 즉시 공분을 산다.",
    exampleSummary: "노동 경시 발언은 특정 기념일이 아니라 상시 뇌관이다.",
    severity: 2,
    category: "labor",
    domains: ["business", "politics", "general"],
  },
  {
    pattern: "외모·체형을 평가·비하하거나 특정 몸을 결함처럼 그리는 표현",
    whyItBackfires:
      "외모 지적은 요청받지 않은 순간 폭력이 된다. 칭찬·유머로 포장해도 당사자에겐 상처로 남는다.",
    exampleSummary: "외모 비하는 시즌과 무관하게, 한마디가 곧바로 반감을 부른다.",
    severity: 2,
    category: "appearance",
    domains: ["entertainment", "creator", "media"],
  },
  {
    pattern: "재난·사고·피해자를 소재나 농담·마케팅 훅으로 소비하는 행위",
    whyItBackfires:
      "재난 앞의 대중 정서는 애도다. 참사를 예시·밈·판촉에 갖다 쓰면 유가족과 사회 전체를 건드린다.",
    exampleSummary: "재난 소비는 날을 가리지 않고, 무신경함이 드러나는 즉시 역풍이 된다.",
    severity: 3,
    category: "disaster",
    domains: ["business", "media", "general"],
  },
  {
    pattern: "성적 언동·성희롱을 농담이나 친밀감 표현으로 포장하는 것",
    whyItBackfires:
      "성비위 감수성은 상시 최고조다. '장난'이라 해도 선을 정하는 건 상대이고, 기록은 남는다.",
    exampleSummary: "성희롱성 언동은 시기 불문, 드러나는 순간 조직과 개인 모두를 무너뜨린다.",
    severity: 3,
    category: "sexual",
    domains: ["business", "entertainment", "general"],
  },
  {
    pattern: "남의 사생활·가족사를 동의 없이 공개하거나 캐묻는 행위",
    whyItBackfires: "사생활 침해는 관계와 신뢰를 즉시 무너뜨린다. 캡처·녹취로 남아 되돌릴 수 없다.",
    exampleSummary: "사생활 폭로는 특정일이 아니라, 옮기는 순간이 곧 사고다.",
    severity: 2,
    category: "privacy",
    domains: ["general", "media", "entertainment"],
  },
  {
    pattern: "표절·저작권 무시, 남의 창작물을 출처 없이 가져다 쓰는 것",
    whyItBackfires:
      "원작자와 커뮤니티가 즉시 비교·검증한다. '몰랐다'는 해명은 통하지 않고 신뢰가 깎인다.",
    exampleSummary: "표절 논란은 시즌과 무관하게, 대조되는 순간 바로 불붙는다.",
    severity: 2,
    category: "ip",
    domains: ["creator", "business", "artist"],
  },
  {
    pattern: "음주·도박·마약을 미화하거나 가볍게 소비하는 콘텐츠",
    whyItBackfires:
      "중독 이슈는 사회적 민감도가 크다. 낭만화·홍보는 모방과 뒷광고 논란으로 직결된다.",
    exampleSummary: "중독 소재 미화는 날짜와 무관하게 상시 역풍의 진원지다.",
    severity: 2,
    category: "vice",
    domains: ["creator", "entertainment", "media"],
  },
  {
    pattern: "정치적 편향을 무신경하게 드러내거나 진영 논리에 편승하는 발언",
    whyItBackfires:
      "공적 인물·브랜드가 한쪽에 서면 반대 진영 전체가 등을 돌린다. 중립 지대가 사라진다.",
    exampleSummary: "정치색 논란은 선거일이 아니어도, 발언 하나로 언제든 양분된다.",
    severity: 2,
    category: "politics",
    domains: ["politics", "business", "media"],
  },
  {
    pattern: "학력·재산으로 사람을 서열화하거나 특혜를 자랑하는 언행",
    whyItBackfires: "계층 위화감은 상시 예민하다. 과시가 클수록 박탈감과 반감이 함께 커진다.",
    exampleSummary: "학벌·계층 과시는 시기 불문, 위화감을 부르는 순간 역풍이 된다.",
    severity: 2,
    category: "class",
    domains: ["general", "entertainment", "academia"],
  },
  {
    pattern: "동물권·환경 감수성을 무시한 자극적 소비·연출",
    whyItBackfires:
      "동물학대·그린워싱 감시가 상시 작동한다. 자극적 장면이나 위장 친환경은 즉시 캠페인 표적이 된다.",
    exampleSummary: "동물권·환경 논란은 특정일이 아니라 상시 감시 대상이다.",
    severity: 2,
    category: "animalEnv",
    domains: ["business", "creator", "media"],
  },
  {
    pattern: "거짓말·이중잣대가 드러나 도덕성 자체가 도마에 오르는 상황",
    whyItBackfires:
      "과거 발언과 현재 행동이 대조되는 순간 신뢰가 무너진다. 해명이 늦을수록 의심은 커진다.",
    exampleSummary: "도덕성 논란은 날을 가리지 않고, 말과 행동이 어긋나는 순간 시작된다.",
    severity: 2,
    category: "honesty",
    domains: ["politics", "entertainment", "business"],
  },
  {
    pattern: "확인 안 된 정보를 사실처럼 단정해 퍼뜨리는 언행",
    whyItBackfires: "'카더라'도 옮기면 책임이 따른다. 오정보 확산은 정정해도 캡처가 먼저 돈다.",
    exampleSummary: "막말·단정 실언은 시기와 무관하게, 내뱉는 순간 기록으로 남는다.",
    severity: 2,
    category: "looseTalk",
    domains: ["politics", "media", "creator"],
  },
  {
    pattern: "병역·군 복무를 유희 소재로 삼거나 안보를 가볍게 조롱하는 것",
    whyItBackfires:
      "병역 감수성은 상시 예민하다. 특혜·회피 정황이나 안보 희화화는 곧바로 공분을 산다.",
    exampleSummary: "병역·안보 관련 무신경함은 특정일이 아니라 상시 뇌관이다.",
    severity: 2,
    category: "military",
    domains: ["entertainment", "sports", "politics"],
  },
  {
    pattern: "'국뽕'·애국 마케팅에 편승하면서 정작 이중잣대가 드러나는 것",
    whyItBackfires:
      "국내용 애국 마케팅과 해외용 침묵이 대조되면 위선으로 읽힌다. 검증은 실시간이다.",
    exampleSummary: "국뽕 이중잣대는 기념일이 아니어도, 대조되는 순간 역풍이 된다.",
    severity: 2,
    category: "nationalism",
    domains: ["business", "gaming", "media"],
  },
];
