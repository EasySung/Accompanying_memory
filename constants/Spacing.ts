/**
 * Spacing.ts — 여백 · 모서리 · 그림자 토큰
 *
 * 시니어 화면은 요소 간 간격을 넉넉히 두어 오터치를 방지한다.
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 28,
  xxxl: 40,

  /** 화면 좌우 기본 패딩 */
  screenH: 22,
  /** 컴포넌트 간 기본 수직 간격 */
  gap: 14,
} as const;

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

/**
 * 다크 테마에서는 그림자가 거의 보이지 않으므로,
 * "떠 있는 표면"은 그림자 대신 약간 밝은 표면색 + 보더로 표현하는 것이 일반적이다.
 * 그래도 안드로이드 elevation/iOS shadow가 필요한 곳을 위해 토큰을 둔다.
 */
export const Shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 22,
    elevation: 12,
  },
} as const;
