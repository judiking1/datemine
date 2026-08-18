import type { Severity } from "@datemine/domain";

/**
 * "오늘의 눈치" pool — general daily cautions for days with no specific event, in the
 * datemine voice (blunt, sticky). NOT tied to any real incident; general wisdom only.
 * One is picked deterministically per date (see fortune.ts), so a given day is stable.
 */
export type Fortune = {
  readonly theme: string;
  readonly level: Severity;
  readonly line: string;
};

export const FORTUNES: readonly Fortune[] = [
  { theme: "말", level: 2, line: "확신에 찬 한마디가 내일의 캡처가 된다" },
  { theme: "SNS", level: 3, line: "지운다고 사라지지 않는다, 이미 박제됐다" },
  { theme: "돈", level: 2, line: "'이번만'이라는 투자 권유, 그게 신호다" },
  { theme: "관계", level: 1, line: "남 얘기 옮기는 입, 결국 내 얘기도 옮긴다" },
  { theme: "일", level: 2, line: "카톡 단체방은 회의록이다, 농담도 증거다" },
  { theme: "술자리", level: 3, line: "취해서 한 말, 멀쩡할 때 책임진다" },
  { theme: "계약", level: 3, line: "읽기 싫은 조항일수록 거기 함정이 있다" },
  { theme: "SNS", level: 2, line: "'선 넘는' 드립, 팔로워가 캡처 먼저 한다" },
  { theme: "말", level: 2, line: "'솔직히 말해서'로 시작하는 말은 대개 사고다" },
  { theme: "감정", level: 1, line: "화날 때 쓴 문자는 보내기 전에 하루 재워라" },
  { theme: "돈", level: 3, line: "고수익·원금보장 동시에 말하면 사기다" },
  { theme: "관계", level: 2, line: "뒷담화 자리의 웃음, 자리 뜨면 방향 바뀐다" },
  { theme: "일", level: 2, line: "'다들 그렇게 해요'는 면책이 안 된다" },
  { theme: "SNS", level: 2, line: "남의 불행에 단 댓글, 오래 남는 건 그거다" },
  { theme: "운전", level: 2, line: "블랙박스는 네 것만 찍는 게 아니다" },
  { theme: "말", level: 1, line: "모르는 건 모른다 해라, 아는 척이 더 비싸다" },
  { theme: "돈", level: 2, line: "지인 통한 '좋은 건', 지인부터 손절 각오해라" },
  { theme: "관계", level: 2, line: "칭찬도 비교로 하면 누군가는 상처받는다" },
  { theme: "감정", level: 1, line: "받은 만큼 갚겠다는 마음, 대개 손해로 끝난다" },
  { theme: "일", level: 3, line: "회사 자료 개인 계정에 올리는 순간 사고다" },
  { theme: "SNS", level: 2, line: "'우리끼리'는 없다, 캡처엔 우리가 없다" },
  { theme: "술자리", level: 2, line: "회식 자리 뒷말, 다음 날 제일 먼저 돈다" },
  { theme: "말", level: 3, line: "농담이라 해도, 듣는 사람이 정한다 농담인지" },
  { theme: "돈", level: 1, line: "공짜 이벤트에 개인정보 다 적어주고 있다" },
  { theme: "관계", level: 1, line: "부탁은 쉽게, 거절은 어렵게 — 그러다 호구 된다" },
  { theme: "건강", level: 1, line: "'괜찮겠지' 미룬 검진, 제일 비싼 미루기다" },
  { theme: "일", level: 2, line: "확인 안 한 '전달', 오보의 시작이다" },
  { theme: "SNS", level: 3, line: "옛 게시물은 시한폭탄, 오늘의 나로 검증된다" },
  { theme: "감정", level: 2, line: "억울할수록 증거부터, 감정은 나중에" },
  { theme: "말", level: 2, line: "'뇌피셜'을 사실처럼 옮기면 네가 책임진다" },
  { theme: "돈", level: 2, line: "급할수록 계약서, 친할수록 계약서" },
  { theme: "운전", level: 3, line: "잠깐이면 되겠지 — 그 잠깐에 다 뒤집힌다" },
  { theme: "관계", level: 2, line: "선의의 오지랖도 상대가 원치 않으면 민폐다" },
  { theme: "일", level: 1, line: "'나중에 정리'한 메일함, 나중은 안 온다" },
  { theme: "술자리", level: 3, line: "운전대 잡을 거면 한 잔도 계산에 넣어라" },
  { theme: "SNS", level: 2, line: "위치·일상 실시간 중계, 보는 눈은 팬만이 아니다" },
  { theme: "감정", level: 1, line: "비교는 남의 하이라이트와 내 비하인드의 싸움이다" },
  { theme: "말", level: 2, line: "사과는 '하지만' 붙는 순간 사과가 아니게 된다" },
  { theme: "돈", level: 3, line: "보증·명의, 우정으로 서주면 우정부터 날아간다" },
  { theme: "관계", level: 1, line: "안부 없이 부탁만 오는 연락, 나도 그러고 있진 않나" },
  { theme: "일", level: 2, line: "'급함'이라 적힌 남의 일정, 내 사고는 아니다" },
  { theme: "건강", level: 2, line: "무리한 자랑용 목표, 몸이 먼저 청구서 보낸다" },
];
