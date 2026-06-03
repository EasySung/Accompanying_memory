/**
 * Colors.ts — 이원화(Dual-Theme) 색상 시스템
 *
 * 설계 원칙
 *  - 환자(Patient)와 보호자(Caregiver)의 정서/가독성을 분리한 두 개의 독립 팔레트를 제공한다.
 *  - 각 화면은 자신의 테마(Patient | Caregiver)만 import 하여 색을 일관되게 적용한다.
 *
 *  ┌ Patient  : 연한 주황 계열 — 따뜻함·활력. 미색 아이보리 배경 + 고대비 주황 포인트 + 다크 차콜 텍스트.
 *  └ Caregiver: 하늘색 계열   — 차분함·신뢰. 라이트 블루그레이 배경 + 스카이/딥오션 블루 포인트 + 선명한 블랙.
 *
 *  ※ 하단 `Colors`/`Gradients`는 공용 인프라 컴포넌트(Screen/Card/Badge 등)의 빌드 안정성을 위해 유지되는
 *    중립 베이스 토큰이다. 신규 화면은 Patient/Caregiver 테마를 직접 사용한다.
 */

// ── 환자 테마: 연한 주황색 계열 ──────────────────────────────────────
export const Patient = {
  bg: '#FFFBF7', // 눈이 편안한 미색 아이보리/오프화이트
  surface: '#FFFFFF',
  surfaceAlt: '#FFF3E9', // 한 단계 진한 표면(입력/칩)
  surfaceDeep: '#FFE8D6', // 트랙/비활성

  primary: '#FF9E66', // 핵심 포인트(밝은 주황)
  primaryDeep: '#E67E22', // 눌림/강조 주황(고대비)
  primarySoft: '#FFE8D6', // 옅은 주황 배경
  onPrimary: '#FFFFFF', // 주황 위 글씨

  text: '#2C2520', // 순수 다크 차콜(흐릿하지 않은 본문)
  textSub: '#8A7A6C', // 보조 텍스트
  textInverse: '#FFFFFF',

  border: '#F2E5D8',
  stop: '#C0392B', // 대화 종료/마이크 정지

  shadow: 'rgba(230,126,34,0.18)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type PatientColorKey = keyof typeof Patient;

// ── 보호자 테마: 하늘색 계열 ─────────────────────────────────────────
export const Caregiver = {
  bg: '#F2F8FC', // 라이트 블루그레이(깨끗·세련)
  surface: '#FFFFFF',
  surfaceAlt: '#E8F1FA', // 입력/세그먼트
  surfaceDeep: '#DCEBFB', // 트랙/비활성

  primary: '#4A90E2', // 스카이 블루(핵심 포인트)
  primaryDeep: '#1F4E79', // 딥 오션 블루(고대비 배너/버튼)
  primarySoft: '#DCEBFB', // 옅은 블루 배경
  onPrimary: '#FFFFFF',

  text: '#1C2833', // 선명한 블랙 계열
  textSub: '#5B6B7A',
  textInverse: '#FFFFFF',

  border: '#D9E6F2',
  borderSoft: '#E8EFF6',

  // 시맨틱
  success: '#27AE60',
  successSoft: '#DCF3E6',
  warning: '#E67E22',
  warningSoft: '#FCE7D5',
  danger: '#E74C3C',
  dangerSoft: '#FBE2DE',

  // 감정 분석 팔레트(기쁨/평온/우울/혼란)
  joy: '#F4B740',
  calm: '#4A90E2',
  sad: '#7F8C9B',
  confusion: '#E07A5F',

  shadow: 'rgba(31,78,121,0.16)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type CaregiverColorKey = keyof typeof Caregiver;

// ── 중립 베이스(공용 인프라 컴포넌트 빌드 호환용) ────────────────────
export const Colors = {
  background: '#F4F6F9',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F6',
  surfaceHigh: '#E2E7EF',
  overlay: 'rgba(20,22,26,0.45)',

  brand: '#1F4E79',
  brandStrong: '#163A5C',
  brandSoft: '#D9E2F3',
  onBrand: '#FFFFFF',

  accent: '#107C41',
  accentStrong: '#0B5C30',
  accentSoft: '#DCF0E4',
  onAccent: '#FFFFFF',

  text: '#1A1C20',
  textSecondary: '#555555',
  textMuted: '#767E89',
  textInverse: '#FFFFFF',

  border: '#E0E0E0',
  borderSoft: '#ECEEF2',

  success: '#107C41',
  successSoft: '#DCF0E4',
  warning: '#B45309',
  warningSoft: '#FDE7D3',
  danger: '#C0392B',
  dangerSoft: '#FBE3E0',

  mint: '#0E7C86',
  coral: '#C2410C',
  lavender: '#6D28D9',
  sky: '#1D4ED8',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

/** Gradients — 공용 컴포넌트(LinearGradient)용 색상 페어 토큰. */
export const Gradients = {
  primary: ['#5B9FEF', '#2E6CC7'] as const,
  sunset: ['#FFB347', '#FF7043'] as const,
  mint: ['#43E97B', '#38B2AC'] as const,
  lavender: ['#A18CD1', '#7B6CF6'] as const,
  peach: ['#FFB347', '#FF7043'] as const,
  sky: ['#E8F4FD', '#F0F7FF'] as const,
  gold: ['#F7971E', '#FFD200'] as const,
  danger: ['#FF6B6B', '#FF4757'] as const,
  warning: ['#F7971E', '#FFD200'] as const,
  memory: [
    ['#667EEA', '#764BA2'],
    ['#FF9A9E', '#FECFEF'],
    ['#A8EDEA', '#FED6E3'],
    ['#FBC2EB', '#A6C1EE'],
    ['#FDDB92', '#D1FDFF'],
    ['#A1C4FD', '#C2E9FB'],
  ] as const,
} as const;

export type GradientKey = keyof typeof Gradients;
