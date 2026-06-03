/**
 * Typography.ts — 시니어 가독성 우선 타입 스케일
 *
 * 설계 원칙
 *  - 환자(이용자) 화면의 본문은 최소 20pt 이상을 보장(spec 요구사항).
 *  - 자간(letterSpacing)은 한글 가독성을 위해 0 ~ 약간의 음수로,
 *    행간(lineHeight)은 넉넉하게(1.4~1.6배) 확보.
 *  - 모든 인터랙티브 요소의 최소 터치 영역은 56px 이상(TOUCH_MIN).
 */

import { TextStyle } from 'react-native';

/** 시니어 접근성: 최소 터치 타깃 높이/너비 (pt) */
export const TOUCH_MIN = 56;

type Variant = TextStyle;

export const Typography = {
  /** 스플래시·랜딩용 초대형 타이틀 */
  display: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.5,
  } as Variant,

  /** 화면 대표 제목 */
  h1: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.4,
  } as Variant,

  /** 섹션 제목 */
  h2: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    letterSpacing: -0.3,
  } as Variant,

  /** 소제목 / 카드 제목 (환자 화면 본문 하한선과 동일한 20pt) */
  h3: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.2,
  } as Variant,

  /** 환자 화면 본문 — 20pt 하한 보장 */
  bodyLarge: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
    letterSpacing: 0,
  } as Variant,

  /** 보호자 화면 등 정보 밀도가 높은 본문 */
  body: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 25,
    letterSpacing: 0,
  } as Variant,

  /** 라벨 / 강조 보조 */
  label: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0,
  } as Variant,

  /** 캡션 / 메타 정보 (보호자 화면 한정 사용) */
  caption: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.2,
  } as Variant,

  /** 버튼 라벨 */
  button: {
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
    letterSpacing: 0,
  } as Variant,
} as const;

export type TypographyKey = keyof typeof Typography;
