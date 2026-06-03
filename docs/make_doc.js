const fs = require('fs');
const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType
} = require('docx');

const CONTENT_W = 9360;
const border = { style: BorderStyle.SINGLE, size: 1, color: "BBBBBB" };
const borders = { top: border, bottom: border, left: border, right: border };
const HEADER_FILL = "D9E2F3";
const cellMargins = { top: 60, bottom: 60, left: 110, right: 110 };

function txt(s, opts = {}) { return new TextRun({ text: String(s), ...opts }); }

function para(text, opts = {}) {
    return new Paragraph({ children: [txt(text, opts.run || {})], spacing: { after: 120 }, ...opts.para });
}

function bullet(text, level = 0) {
    return new Paragraph({
        numbering: { reference: "bullets", level },
        children: parseInline(text),
        spacing: { after: 60 }
    });
}

function numItem(text) {
    return new Paragraph({
        numbering: { reference: "nums", level: 0 },
        children: parseInline(text),
        spacing: { after: 60 }
    });
}

// supports **bold** inline
function parseInline(text) {
    const parts = String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return parts.map(p => {
        if (p.startsWith("**") && p.endsWith("**")) return txt(p.slice(2, -2), { bold: true });
        return txt(p);
    });
}

function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [txt(text)], spacing: { before: 280, after: 160 } }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [txt(text)], spacing: { before: 220, after: 120 } }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [txt(text)], spacing: { before: 160, after: 100 } }); }

function makeTable(headers, rows) {
    const n = headers.length;
    const colW = Math.floor(CONTENT_W / n);
    const widths = Array(n).fill(colW);
    widths[n - 1] = CONTENT_W - colW * (n - 1);

    const headerRow = new TableRow({
        tableHeader: true,
        children: headers.map((hdr, i) => new TableCell({
            borders, width: { size: widths[i], type: WidthType.DXA },
            shading: { fill: HEADER_FILL, type: ShadingType.CLEAR }, margins: cellMargins,
            children: [new Paragraph({ children: [txt(hdr, { bold: true, size: 20 })] })]
        }))
    });

    const bodyRows = rows.map(r => new TableRow({
        children: r.map((c, i) => new TableCell({
            borders, width: { size: widths[i], type: WidthType.DXA }, margins: cellMargins,
            children: [new Paragraph({ children: parseInline(c), spacing: { after: 0 } })]
        }))
    }));

    return new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: widths,
        rows: [headerRow, ...bodyRows]
    });
}

const children = [];
const P = (...a) => children.push(para(...a));
const T = (h, r) => children.push(makeTable(h, r));

// ===== TITLE =====
children.push(new Paragraph({
    children: [txt("기억동행 (Memory Companion) — 개발 기준 문서 (PROJECT SPEC)", { bold: true, size: 34 })],
    spacing: { after: 160 }
}));
children.push(new Paragraph({
    children: [txt("본 문서는 「2026 SW중심대학 디지털경진대회」 참가작 기억동행의 기획안을 AI 코딩 에이전트가 파싱·활용할 수 있도록 구조화한 단일 출처(Single Source of Truth) 문서이다. 모든 개발(프롬프트, 아키텍처, 기능 구현)의 기본 정보로 사용한다.", { italics: true, color: "555555" })],
    spacing: { after: 200 }
}));

// ===== 0. META =====
children.push(h1("0. PROJECT_META (프로젝트 메타정보)"));
T(["항목", "값"], [
    ["team_id", "5432"],
    ["product_name", "기억동행 (Memory Companion)"],
    ["product_tagline", "초기 치매 환자의 개인 기억 데이터 기반 회상 대화와 인지 활동을 돕는 AI 예방 돌봄 솔루션"],
    ["keywords", "초고령 사회, AI 헬스케어, 초기 치매 예방, 돌봄 부담 완화"],
    ["competition", "2026 SW중심대학 디지털경진대회"],
    ["submission_date", "2026-05-20"],
    ["team_leader", "신미리"],
    ["organization", "한신대학교 SW중심대학사업단"],
    ["finals_date", "2026-08-11 (화)"],
    ["finals_location", "대한상공회의소 (서울시 중구 세종대로 39)"],
    ["finals_note", "본선 진출 시 본선 평가·시상식 필수 참석"],
]);
children.push(h3("one_line_definition (한 줄 정의)"));
P("기억동행은 병원 밖 일상에서 AI Agent가 환자의 상태를 지속적으로 판단하고 인지 루틴을 형성하는, 개인 기억 기반 예방형 인지 케어 SW이다.");

// ===== 1. CORE PROBLEM =====
children.push(h1("1. CORE_PROBLEM (핵심 문제)"));

children.push(h2("1.1 problem_1 — 치매 환자 및 인지 저하 의심자의 급증"));
children.push(bullet("2025년 기준 65세 이상 추정 치매 환자 약 97만 명."));
children.push(bullet("2026년 약 101만 명으로 100만 명 돌파 전망."));
children.push(bullet("2044년 약 201만 명까지 증가 예측."));
children.push(bullet("치매·인지 저하는 개인 문제가 아니라 초고령사회 전반의 생활 관리 문제로 확대."));
children.push(bullet("출처: 보건복지부 [2023년 치매환자역학조사 및 실태조사 결과발표]"));
children.push(h3("dementia_projection (65세 이상 추정 치매 환자 수 추이, 단위: 만 명)"));
T(["연도", "추정 치매 환자 수(만 명)"], [
    ["2025", "97"], ["2026", "101"], ["2030", "121"], ["2040", "180"], ["2044", "201"]
]);

children.push(h2("1.2 problem_2 — 치매 장기화로 인한 보호자의 부담 증가"));
children.push(bullet("치매 관리는 단순 의료 문제가 아니라 장기 돌봄 비용과 보호자 부담이 지속 발생하는 고비용 사회 문제."));
children.push(bullet("특히 초기 치매 환자는 가정 중심 관리가 장기간 이루어져 보호자의 시간적·정서적 부담이 큼."));
children.push(bullet("초고령사회 진입과 함께 예방 중심 인지 관리 서비스 및 보호자 부담 완화 솔루션 수요 확대."));
children.push(bullet("출처: 중앙치매센터 [2025년 치매상담사례집-발췌본] - 보호자 사례 재구성"));
children.push(bullet("관리 공백은 단순 돌봄 문제가 아니라, 장기 치매 관리 비용 증가 + 예방 관리 수요 확대라는 사회적 문제로 이어짐."));
children.push(h3("care_gap_analysis (실제 상황 / 기존 지원 제도 / 여전히 남는 문제)"));
T(["실제 상황", "기존 지원 제도", "여전히 남는 문제"], [
    ["보호자가 장기간 돌봄으로 휴식 부족 및 반복 질문 대응 피로 경험", "장기요양 가족휴가제·단기보호 서비스", "병원 밖 일상에서 반복 질문 대응·상태 관찰은 여전히 보호자 부담"],
    ["거동 불편으로 병원 방문이 어려움", "재택의료센터 방문 진료", "병원 방문 전 일상 변화 데이터를 지속적으로 파악하기 어려움"],
    ["반복 질문·혼란·감정 변화(BPSD) 발생", "치매안심센터·전문기관 지원", "\"평소와 다른 상태인지\"를 객관적으로 판단하기 어려움"],
]);
children.push(h3("cost_statistics (치매 관리 비용·규모 통계)"));
T(["항목", "내용", "의미"], [
    ["환자 1인당 연간 치매 관리 비용", "약 3,138만 원", "장기 돌봄·관리 비용 부담 큼"],
    ["국내 치매 관리 사회적 비용", "약 24.6조 원", "국가적 관리 비용 증가"],
    ["경도인지장애(MCI) 대상자", "약 298만 명", "예방 관리 서비스 확장 가능"],
    ["보호자 부담", "시간·정서·경제적 부담 증가", "보호자 지원 서비스 수요 증가"],
]);
children.push(bullet("출처: 보건복지부 [2023년 치매역학조사 및 실태조사 결과 발표(2025)], 중앙치매센터 [대한민국 치매현황 2023] 자료 재구성"));
children.push(bullet("치매 장기화로 인한 중증 단계 이후 인지 기능 회복이 매우 어려우므로, MCI 및 초기 치매 단계에서의 조기 개입과 지속적 관리가 중요."));
children.push(bullet("국내 MCI 대상자 약 298만 명 규모로 추정되며, 이 시기는 인지 기능 저하 이전 개입 효과가 상대적으로 높은 '예방 개입 골든타임'에 해당."));

children.push(h2("1.3 problem_3 — 초기 치매 환자의 회상치료 효과"));
children.push(bullet("MCI 및 초기 치매 단계에서 회상치료 요법의 효과가 다양한 연구를 통해 보고됨."));
children.push(bullet("회상치료: 과거 경험·사진·이야기를 활용해 장기 기억 회상을 유도하는 비약물적 접근법. 인지 기능 유지와 정서 안정에 긍정적 효과."));
children.push(bullet("현재 서비스의 한계: 치매 위험 검사·정보 제공·단순 인지 퀴즈 중심 구조에 머물러, 일상 속 반복 회상 대화와 변화 추이 관찰을 지속 지원하는 개인화 구조가 부족."));
children.push(bullet("기억동행의 제안: AI Agent가 사용자의 기억 반응·대화 패턴·감정 변화를 분석하고, 개인화 회상 대화·인지 자극·보호자 리포트를 제공하는 예방형 인지 루틴 서비스."));
children.push(h3("research_basis (연구 근거)"));
T(["출처", "연구 제목"], [
    ["정문가 (2025)", "중국 장기요양시설 거주 치매 노인의 우울감 및 삶의 질 개선을 위한 홍가(红歌) 중심 회상음악치료 프로그램 개발 및 효과"],
    ["김영란 (2014)", "회상치료프로그램이 치매노인의 인지·일상생활 수행능력 및 우울에 미치는 효과"],
    ["이성은 (2024)", "노인의 여가만족과 인지기능의 관계: 사회적 관계망의 매개효과. 문화기술의 융합"],
]);

// ===== 2. SOLUTION =====
children.push(h1("2. SOLUTION (해결방안)"));
children.push(h2("2.1 research_to_feature_mapping (연구 → 기억동행 연결)"));
T(["연구", "핵심 연구 결과", "기억동행 연결 방식", "역할"], [
    ["정문가(2025) 회상음악치료 효과", "회상음악치료 적용 후 우울감 감소 및 삶의 질 향상 확인", "AI 기반 회상 상호작용을 통한 정서 안정 및 회상 습관 형성 지원", "정서적 안정"],
    ["김영란(2014) 회상치료 효과 연구", "회상치료 참여군 MMSE-K 점수 유의미 향상(p<.01) 보고", "개인화 회상 대화를 통한 인지 자극 및 기억 회상 지원", "인지 기능 유지"],
    ["이성은(2024) 여가만족과 인지기능 관계", "여가만족과 사회적 관계망이 인지기능과 유의한 관련성 확인", "지속적 상호작용을 통한 사회적 연결감 및 인지 활동 지원", "라이프스타일 정당화"],
]);
children.push(h2("2.2 problem_solution_matrix (문제 상황 → AI Agent 해결)"));
T(["문제 상황", "근거", "기억동행 AI Agent 해결"], [
    ["회상 대화 부족 → 인지 저하 변화 놓침", "병원 외 대부분 시간을 가정에서 보내며 일상 인지 자극 부족", "AI가 먼저 회상 대화 시작 → 가족 사진·추억 기반 질문 생성 → 인지 루틴 형성"],
    ["치매·MCI 대상 급증 → 예방 관리 수요 증가", "2026년 치매 약 101만 명, MCI 약 298만 명", "초기 치매·MCI 대상 맞춤 회상 대화 및 인지 루틴 제공 → 시니어 확장 가능"],
    ["보호자의 반복 돌봄 부담 증가", "반복 질문 대응·감정 변화·혼란 상황(BPSD) 대응 및 판단 어려움 → 장기 돌봄 피로 및 관리 공백 발생", "응답 지연·반복 표현·감정 변화 분석 → 위험 알림 + 리포트 제공"],
    ["병원 밖 상태 변화 파악 어려움", "재택의료 지원 존재하지만 일상 변화 데이터 부족", "회상 대화·인지 체크 기록 → 변화 추이 시각화"],
    ["기존 치매 앱 지속 사용성 낮음", "검사·정보 제공 중심 → 반복 사용 유도 부족", "AI가 먼저 대화 시작 → 다음 회상 주제 자동 제안"],
    ["인지 수준 차이로 동일 활동 효과 제한", "사용자별 상태 차이 큼", "AI가 성공률 분석 → 질문 난이도 자동 조절"],
]);
children.push(h2("2.3 core_mechanism (핵심 작동 원리)"));
children.push(new Paragraph({ children: parseInline("기억동행은 단순 정보 제공이 아니라, AI Agent가 **회상 대화 참여도, 응답 시간 변화, 반복 표현 빈도** 등 사용자의 상호작용 데이터를 지속적으로 분석한다. 사용자의 대화형 인지 반응 체크 데이터를 기반으로, 반응 변화에 따라 **다음 대화 방식과 질문 난이도를 조정하는 \"판단 + 행동 기반 적응형 인지 케어 구조\"**를 가진다. 보호자는 변화 추이와 인지 변화 신호를 리포트 형태로 확인할 수 있다."), spacing: { after: 120 } }));

// ===== 3. EXPECTED EFFECTS =====
children.push(h1("3. EXPECTED_EFFECTS (기대효과)"));
children.push(numItem("개인화 회상 대화와 인지 루틴을 통해 환자의 반응 변화·반복 표현·감정 상태를 지속 분석하여 변화 징후를 조기 탐지."));
children.push(numItem("위험 징후 알림·일간/주간 리포트 제공을 통해 보호자의 관찰 부담을 줄이고, 인지 저하 지연과 돌봄 부담 완화를 동시 지원."));
children.push(numItem("초기 치매는 '매일의 작은 변화'가 중요한 질환 특성을 가지므로, 병원 방문 사이의 관리 공백을 줄이고 일상 속 예방형 인지 루틴 형성을 지원."));
children.push(new Paragraph({ children: [txt("요약: 기억동행은 병원 밖 일상에서 AI Agent가 환자의 상태를 지속적으로 판단하고 인지 루틴을 형성하는 예방형 인지 케어 서비스이다.", { italics: true })], spacing: { before: 100, after: 120 } }));

// ===== 4. TECHNICAL IMPLEMENTATION =====
children.push(h1("4. TECHNICAL_IMPLEMENTATION (기술 구현 세부사항)"));
children.push(h2("4.1 system_flow (전체 시스템 흐름도)"));
P("4단계 파이프라인으로 구성된다: [1. 데이터 입력(보호자)] → [2. 기억 저장소] → [3. AI 예방형 인지 Care Agent] → [4. 결과 및 보호자 리포트]");
children.push(h3("stage_1_data_input (데이터 입력 - 보호자)"));
children.push(bullet("환자 등록: 기본 프로필"));
children.push(bullet("가족정보 입력: 관계·호칭"));
children.push(bullet("사진 업로드: 앨범·인물"));
children.push(bullet("추억 데이터: 에피소드·장소"));
children.push(h3("stage_2_memory_storage (기억 저장소)"));
children.push(bullet("개인 기억 DB: 구조화 데이터"));
children.push(bullet("Vector DB 임베딩: 개인 기억 저장"));
children.push(bullet("RAG 기억 검색: 유사 기억 검색"));
children.push(h3("stage_3_ai_care_agent (AI 예방형 인지 Care Agent)"));
children.push(bullet("개인화 회상 대화: 기억 기반 질문 생성"));
children.push(bullet("인지 체크 Lite: 날짜·기억·사진"));
children.push(bullet("위험 신호 탐지: 반복 표현·반응 변화"));
children.push(h3("stage_4_caregiver_report (결과 및 보호자 리포트)"));
children.push(bullet("인지 변화 분석: 변화 추이 분석"));
children.push(bullet("대화 기록 요약: 주요 내용 정리"));
children.push(bullet("위험 알림: Push 알림"));
children.push(bullet("주간 리포트: 보호자 제공"));

children.push(h2("4.2 feature_specification (핵심 기능 명세 — 특징별 경험/역할)"));
T(["특징", "환자 경험", "보호자 경험", "AI 에이전트 역할"], [
    ["보호자 기억 데이터 입력", "개인 기억 기반 맞춤 대화 준비", "사진첩 기반 추억 후보 추천 후 간편 등록", "이미지·날짜·장소 정보를 분석하여 추억 후보 추천 및 개인 기억 DB 구축 지원"],
    ["RAG 기반 개인화 회상 대화", "맞춤형 회상 대화 및 기억 회상 질문", "환자의 기억·반응 확인", "RAG 검색 → 회상 질문 생성 → 반응 기반 대화 주제 조정"],
    ["대화형 인지 체크 Lite", "지남력·기억회상·언어·주의집중 기반 인지 활동 수행", "인지 결과 및 변화 추이 확인", "반응 분석 → 난이도 조절 → 인지 변화 추적"],
    ["선제적 대화 제안 AI", "설정 시간 AI 대화 시작 및 안정 대화", "위험 징후 및 상태 확인", "참여도·감정 변화·인지 변화 신호 분석 → 대화 시점·주제 자동 조정"],
    ["인지 변화 모니터링 대시보드", "회상·인지 활동 기반 자기 관리", "리포트 및 상태 변화 모니터링", "대화·감정·인지 데이터 종합 분석 → 리포트 생성"],
]);

children.push(h2("4.3 tech_stack_usage (기술 활용 방식 + MVP 포함 여부)"));
T(["기술", "활용 방식", "MVP"], [
    ["LLM", "환자 맞춤형 회상 대화 생성 및 후속 질문 생성", "포함"],
    ["RAG", "보호자가 입력한 가족·추억 데이터 기반 개인 기억 검색", "포함"],
    ["Vector DB", "사진·가족 정보·추억 데이터 장기 기억 저장 및 유사도 검색", "포함"],
    ["STT / TTS", "고령층 음성 입력·출력 기반 자연스러운 상호작용 지원", "포함"],
    ["Text Analysis", "반복 표현·반응 시간·감정 변화·참여도 분석", "포함"],
    ["Dashboard", "보호자용 상태 변화 리포트·위험 알림·변화 추이 시각화", "포함"],
    ["PostgreSQL / Supabase", "사용자·대화 기록·인지 활동·파일 데이터 저장", "포함"],
]);

children.push(h2("4.4 system_architecture (시스템 아키텍처 — 영역별 기술·역할)"));
T(["시스템 영역", "사용 기술", "역할"], [
    ["Frontend", "React Native", "환자·보호자 앱 UI"],
    ["Backend API", "FastAPI", "인증·세션·알림·데이터 처리"],
    ["AI Agent", "LLM + RAG + STT/TTS", "회상 대화 생성·상태 분석·행동 조정"],
    ["Data Layer", "PostgreSQL + Vector DB", "사용자·기억 데이터 저장"],
    ["Output", "Dashboard", "리포트·위험 알림 제공"],
]);

children.push(h2("4.5 tech_strategy (기술 전략)"));
children.push(bullet("초기 치매 환자와 시니어의 일상 속 인지 자극과 회상 루틴 형성에 초점을 둔 예방형 인지 관리 서비스로 설계."));
children.push(bullet("LLM, STT/TTS, Vector DB, RAG 등 검증된 상용 AI 기술을 조합하여 모델 재학습 없이 구현 가능한 현실적 MVP 구조 설계."));
children.push(bullet("단순 챗봇 구조가 아니라, 사용자 상태 분석 결과에 따라 다음 상호작용을 조정하는 AI Agent 기반 적응형 구조 적용."));

children.push(h2("4.6 scalability (확장성)"));
children.push(bullet("실제 전화 발신: 전화 기반 음성 대화 확장."));
children.push(bullet("병원·치매안심센터 연계: 보호자 동의 기반으로 변화 리포트를 치매안심센터·재택의료센터 상담 참고 자료로 제공."));
children.push(bullet("인지 분석 고도화: 음성·행동 패턴 기반 변화 탐지 정확도 향상."));

// ===== 5. BUSINESS MODEL =====
children.push(h1("5. BUSINESS_MODEL (비즈니스 모델)"));
children.push(h2("5.1 vision (목표)"));
P("\"인지 저하 예방과 보호자 부담 완화를 지원하는 예방형 AI 인지 케어 서비스\"를 목표로 한다. 치매 예방 서비스는 신뢰도와 실제 사용 데이터가 서비스 채택에 중요한 영향을 미치므로, 공공기관 기반 신뢰 확보 → 민간 시장 확장 → 개인 구독 시장 진출 구조로 단계적으로 성장한다.");
children.push(h2("5.2 go_to_market_stages (단계별 시장 진입 전략)"));
T(["단계", "타깃", "대상", "핵심 가치", "수익 방식"], [
    ["1단계", "B2G (검증)", "치매안심센터, 보건소, 주야간 보호센터", "공신력 확보, 초기 데이터 축적, 서비스 검증", "PoC(실증사업), 시범 운영, 기관 협력 기반 확장"],
    ["2단계", "B2B (확장)", "민간 요양시설, 실버타운, 기업 복지(EAP), 보험사", "돌봄 서비스 차별화, 보호자 만족도 향상", "SaaS 라이선스, 단체 계약"],
    ["3단계", "B2C (성장)", "보호자, 50~60대 시니어", "개인화 AI 회상 대화, 인지 변화 리포트", "월 구독형 (9,900~19,900원)"],
]);

// ===== 6. DIFFERENTIATION =====
children.push(h1("6. DIFFERENTIATION (차별성)"));
children.push(h2("6.1 competitor_comparison (경쟁 서비스 비교)"));
T(["비교 기준", "치매체크", "기억마을", "브레인핏45 / 기억친구", "기억동행"], [
    ["주요 대상", "치매 위험군·노인", "치매 보호자", "45세 이상 예방 관심층", "초기 치매 환자·시니어 + 보호자"],
    ["핵심 목적", "치매위험 확인·예방 정보·돌봄 서비스", "치매 돌봄 절차·행정 정보 안내", "치매 예방 미션·위험 점수 확인", "일상 회상 대화 기반 인지 루틴 형성"],
    ["인지 자극 방식", "검사·예방수칙·돌봄 기능", "정보 제공·절차 안내", "걷기·퀴즈·미션", "개인 기억 기반 회상 대화"],
    ["개인화 수준", "검사 결과 기반 맞춤 정보", "보호자 상황별 절차 안내", "위험 점수 기반 맞춤 처방", "가족·사진·추억 데이터 기반 개인화"],
    ["보호자 역할", "검사·돌봄 보조", "핵심 사용자", "제한적", "기억 입력 + 변화 리포트 확인 핵심 관리자"],
    ["AI Agent 역할", "제한적", "제한적", "제한적", "상태 판단 + 회상 질문 생성 + 루틴 제안"],
]);
children.push(h2("6.2 key_differentiator (가장 큰 차별점)"));
children.push(new Paragraph({ children: parseInline("기억동행의 가장 큰 차별점은 공통 콘텐츠가 아닌 **'환자 개인의 기억'을 AI의 핵심 데이터로 사용**한다는 점이다."), spacing: { after: 80 } }));
children.push(bullet("기존 치매 앱처럼 검사 결과·예방 정보 제공에 머무르는 서비스가 아님."));
children.push(bullet("보호자가 제공한 가족·사진·추억 데이터를 기반으로 AI가 회상 대화를 선제적으로 제공하고 환자의 상태 변화를 지속 분석."));
children.push(bullet("AI Agent는 반응 속도·반복 표현·감정 변화·대화 참여도를 분석하여, 회상 주제·질문 난이도·대화 방식·알림 제공 여부를 스스로 조정하는 적응형 구조를 적용."));
children.push(bullet("즉, 병원 밖 일상에서 AI가 환자의 상태를 지속적으로 살피고, 다음 상호작용을 스스로 조정하는 개인 기억 기반 예방형 인지 케어 SW이다."));

// ===== 7. GLOSSARY =====
children.push(h1("7. KEY_ENTITIES_GLOSSARY (개발 참고용 핵심 개념 사전)"));
T(["용어", "정의 / 개발 시 함의"], [
    ["AI Agent", "상태 판단 + 행동 조정을 수행하는 적응형 인지 케어 엔진. 단순 챗봇 아님."],
    ["회상 대화 (Reminiscence Dialogue)", "가족/사진/추억 데이터 기반으로 AI가 생성하는 개인화 질문·대화. RAG로 개인 기억 검색 후 생성."],
    ["인지 체크 Lite", "지남력·기억회상·언어·주의집중 기반의 가벼운 대화형 인지 활동. 결과로 난이도 자동 조절."],
    ["적응형 구조 (Adaptive)", "반응속도·반복표현·감정변화·참여도 분석 → 회상주제/질문난이도/대화방식/알림여부 자동 조정."],
    ["선제적 대화 (Proactive)", "설정 시간에 AI가 먼저 대화를 시작. 사용자 입력을 기다리지 않음."],
    ["위험 신호 탐지", "응답 지연·반복 표현·감정 변화 분석 → 위험 알림 트리거."],
    ["보호자 리포트", "일간/주간 변화 추이·대화 요약·위험 알림을 종합한 대시보드 출력물."],
    ["BPSD", "치매의 행동심리증상(반복 질문·혼란·감정 변화). 탐지·대응 대상."],
    ["MCI", "경도인지장애. 예방 개입 골든타임 대상층(국내 약 298만 명)."],
    ["개인 기억 DB", "보호자 입력(가족/사진/추억)을 구조화 저장. Vector DB 임베딩의 원천."],
    ["MVP 범위", "LLM, RAG, Vector DB, STT/TTS, Text Analysis, Dashboard, PostgreSQL/Supabase 전부 포함."],
]);

// ===== 8. DATA ENTITIES =====
children.push(h1("8. DATA_ENTITIES_HINT (구현 시 데이터 모델 힌트)"));
children.push(new Paragraph({ children: [txt("기획서 기반으로 추론한 개발용 엔티티 가이드(원문 명시 항목 + 구현 시 필요한 최소 구조).", { italics: true, color: "555555" })], spacing: { after: 100 } }));
children.push(bullet("User(환자): 기본 프로필, 인지 수준, 설정 대화 시간."));
children.push(bullet("Caregiver(보호자): 환자 연결, 알림 수신 설정, 리포트 열람 권한."));
children.push(bullet("MemoryItem(추억 데이터): 사진/인물/관계·호칭/날짜/장소/에피소드 → Vector DB 임베딩 대상."));
children.push(bullet("Conversation(회상 대화): 질문/응답/응답시간/반복표현 빈도/참여도/감정 라벨."));
children.push(bullet("CognitiveCheck(인지 체크 Lite): 영역(지남력·기억회상·언어·주의집중)/성공률/난이도."));
children.push(bullet("RiskSignal(위험 신호): 응답 지연·반복 표현·감정 변화 기반 트리거, 알림 상태."));
children.push(bullet("Report(리포트): 일간/주간 집계, 변화 추이, 대화 요약, 위험 알림 목록."));

// ===== 9. SOURCES =====
children.push(h1("9. SOURCES (출처 일람)"));
children.push(bullet("보건복지부, [2023년 치매환자역학조사 및 실태조사 결과발표]."));
children.push(bullet("보건복지부, [2023년 치매역학조사 및 실태조사 결과 발표(2025)]."));
children.push(bullet("중앙치매센터, [대한민국 치매현황 2023]."));
children.push(bullet("중앙치매센터, [2025년 치매상담사례집-발췌본] (보호자 사례 재구성)."));
children.push(bullet("정문가 (2025), 중국 장기요양시설 거주 치매 노인의 우울감 및 삶의 질 개선을 위한 홍가(红歌) 중심 회상음악치료 프로그램 개발 및 효과."));
children.push(bullet("김영란 (2014), 회상치료프로그램이 치매노인의 인지·일상생활 수행능력 및 우울에 미치는 효과."));
children.push(bullet("이성은 (2024), 노인의 여가만족과 인지기능의 관계: 사회적 관계망의 매개효과. 문화기술의 융합."));

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Malgun Gothic", size: 21 } } },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 28, bold: true, color: "1F4E79", font: "Malgun Gothic" },
                paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0 }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 24, bold: true, color: "2E5496", font: "Malgun Gothic" },
                paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 }
            },
            {
                id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 22, bold: true, color: "444444", font: "Malgun Gothic" },
                paragraph: { spacing: { before: 160, after: 100 }, outlineLevel: 2 }
            },
        ]
    },
    numbering: {
        config: [
            { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 280 } } } }] },
            { reference: "nums", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 280 } } } }] },
        ]
    },
    sections: [{
        properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children
    }]
});

Packer.toBuffer(doc).then(buf => { fs.writeFileSync("memory_companion_spec.docx", buf); console.log("written"); });