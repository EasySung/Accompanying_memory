/**
 * theme.ts — 디자인 시스템 배럴(barrel).
 *  - 신규 화면: `import { Patient } from '@/constants/theme'` / `import { Caregiver } ...`
 *  - 공용 컴포넌트: `import { Colors, Gradients, Typography, Spacing } ...`
 */

export { Colors, Gradients, Patient, Caregiver } from './Colors';
export type {
  ColorKey,
  GradientKey,
  PatientColorKey,
  CaregiverColorKey,
} from './Colors';
export { Typography, TOUCH_MIN } from './Typography';
export type { TypographyKey } from './Typography';
export { Spacing, Radius, Shadow } from './Spacing';
