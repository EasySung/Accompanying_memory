/**
 * caregiver/report — 종합 임상 인지 케어 대시보드 (의료용 스타일)
 *  1) 임상 KPI 2×2 (반응 지연 시간 임계 초과 시 소프트 레드 스위칭)
 *  2) 이번 주 vs 지난 주 2중 막대 그래프
 *  3) 인지 영역별 수평 게이지 + 상태 뱃지
 *  4) AI 종합 임상 소견서 + 행동 자극 권장 케어 가이드
 *  + PDF 미리보기 모달(A4 보고서 서식)
 *  - 아이콘은 Feather 라인 아이콘으로 통일.
 */

import BackButton from '@/components/BackButton';
import { Caregiver } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SOFT_RED = '#E74C3C';
const SOFT_RED_BG = '#FBE2DE';
const LAST_GRAY = '#E0E0E0';

const PERIODS = ['일간', '주간', '월간'] as const;
type Period = (typeof PERIODS)[number];

type Kpi = {
  key: string;
  label: string;
  value: string;
  unit: string;
  delta: string;
  up: boolean;
  danger: boolean;
  icon: React.ComponentProps<typeof Feather>['name'];
};

const KPIS: Kpi[] = [
  { key: 'repeat', label: '반복 표현 빈도', value: '5', unit: '회', delta: '+2', up: true, danger: false, icon: 'repeat' },
  { key: 'orient', label: '지남력 성취율', value: '78', unit: '%', delta: '-4', up: false, danger: false, icon: 'compass' },
  { key: 'engage', label: '대화 참여도', value: '82', unit: '점', delta: '+3', up: true, danger: false, icon: 'message-square' },
  { key: 'delay', label: '반응 지연 시간', value: '2.8', unit: '초', delta: '+0.4', up: true, danger: true, icon: 'clock' },
];

type WeekDay = { d: string; last: number; now: number };
const WEEK: WeekDay[] = [
  { d: '월', last: 0.5, now: 0.55 },
  { d: '화', last: 0.55, now: 0.6 },
  { d: '수', last: 0.6, now: 0.52 },
  { d: '목', last: 0.52, now: 0.68 },
  { d: '금', last: 0.62, now: 0.72 },
  { d: '토', last: 0.58, now: 0.66 },
  { d: '일', last: 0.6, now: 0.7 },
];

type Domain = { label: string; score: number; status: '우수' | '양호' | '주의' };
const DOMAINS: Domain[] = [
  { label: '지남력', score: 78, status: '양호' },
  { label: '단기 기억력', score: 64, status: '주의' },
  { label: '언어 유창성', score: 85, status: '우수' },
  { label: '주의 집중력', score: 72, status: '양호' },
];

const STATUS_COLOR: Record<Domain['status'], { bg: string; fg: string }> = {
  우수: { bg: Caregiver.successSoft, fg: Caregiver.success },
  양호: { bg: Caregiver.primarySoft, fg: Caregiver.primaryDeep },
  주의: { bg: Caregiver.warningSoft, fg: Caregiver.warning },
};

type CareTip = { icon: React.ComponentProps<typeof Feather>['name']; title: string; desc: string };
const CARE_GUIDE: CareTip[] = [
  { icon: 'sunrise', title: '규칙적인 아침 산책', desc: '오전 인지 활동 전 10분 산책으로 각성도를 높여주세요.' },
  { icon: 'music', title: '애창곡 함께 듣기', desc: '익숙한 노래는 장기 기억과 정서 안정에 도움이 돼요.' },
  { icon: 'image', title: '추억 사진 회상', desc: '손주·가족 사진을 보며 이름을 함께 떠올려 보세요.' },
  { icon: 'coffee', title: '오후 충분한 휴식', desc: '반응 지연이 늘어나는 오후엔 충분히 쉬게 해주세요.' },
];

const PATIENT = { name: '김순자', age: '82', gender: '여성', date: '2026-06-03' };

export default function Report() {
  const [period, setPeriod] = useState<Period>('주간');
  const [preview, setPreview] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackButton bg={Caregiver.surfaceAlt} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>종합 인지 리포트</Text>
      </View>

      <View style={styles.tabs}>
        {PERIODS.map((p) => {
          const on = p === period;
          return (
            <Pressable key={p} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => setPeriod(p)} style={[styles.tab, on && styles.tabOn]}>
              <Text style={[styles.tabText, on && styles.tabTextOn]}>{p}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1) 임상 KPI 2×2 */}
        <Text style={styles.secTitle}>임상 핵심 지표</Text>
        <View style={styles.kpiGrid}>
          {KPIS.map((k) => (
            <View key={k.key} style={[styles.kpiCard, k.danger && styles.kpiCardDanger]}>
              <View style={styles.kpiTop}>
                <Feather name={k.icon} size={18} color={k.danger ? SOFT_RED : Caregiver.primary} />
                <View style={[styles.kpiBadge, { backgroundColor: k.danger ? SOFT_RED_BG : Caregiver.primarySoft }]}>
                  <Feather name={k.up ? 'arrow-up' : 'arrow-down'} size={12} color={k.danger ? SOFT_RED : Caregiver.primaryDeep} />
                  <Text style={[styles.kpiBadgeText, { color: k.danger ? SOFT_RED : Caregiver.primaryDeep }]}>{k.delta}</Text>
                </View>
              </View>
              <Text style={[styles.kpiValue, { color: k.danger ? SOFT_RED : Caregiver.text }]}>
                {k.value}
                <Text style={styles.kpiUnit}> {k.unit}</Text>
              </Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* 2) 2중 막대 그래프 */}
        <Text style={styles.secTitle}>주간 인지 변화 추이</Text>
        <View style={styles.card}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: LAST_GRAY }]} />
              <Text style={styles.legendText}>지난주</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Caregiver.primary }]} />
              <Text style={styles.legendText}>이번주</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {WEEK.map((w) => (
              <View key={w.d} style={styles.chartCol}>
                <View style={styles.chartBars}>
                  <View style={[styles.dualBar, { height: `${w.last * 100}%`, backgroundColor: LAST_GRAY }]} />
                  <View style={[styles.dualBar, { height: `${w.now * 100}%`, backgroundColor: Caregiver.primary }]} />
                </View>
                <Text style={styles.chartX}>{w.d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 3) 인지 영역별 게이지 */}
        <Text style={styles.secTitle}>인지 영역별 분석</Text>
        <View style={styles.card}>
          {DOMAINS.map((d) => {
            const sc = STATUS_COLOR[d.status];
            return (
              <View key={d.label} style={styles.domain}>
                <View style={styles.domainTop}>
                  <Text style={styles.domainLabel}>{d.label}</Text>
                  <View style={styles.domainRight}>
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[styles.statusText, { color: sc.fg }]}>{d.status}</Text>
                    </View>
                    <Text style={styles.domainScore}>{d.score}</Text>
                  </View>
                </View>
                <View style={styles.gaugeTrack}>
                  <View style={[styles.gaugeFill, { width: `${d.score}%`, backgroundColor: sc.fg }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* 4) AI 종합 임상 소견서 */}
        <Text style={styles.secTitle}>AI 종합 임상 소견</Text>
        <View style={styles.opinionCard}>
          <View style={styles.opinionGuide} />
          <View style={styles.flex}>
            <View style={styles.opinionHead}>
              <Feather name="activity" size={20} color={Caregiver.primaryDeep} />
              <Text style={styles.opinionTitle}>임상 분석 요약</Text>
            </View>
            <Text style={styles.opinionText}>
              이번 {period} 김순자 할머니는 언어 유창성과 대화 참여도가 안정적으로 유지되었습니다. 다만 반응 지연 시간이
              임계치(2.5초)를 초과(2.8초)하였고 단기 기억력 영역이 ‘주의’ 수준으로 관찰됩니다. 오후 시간대
              인지 부하가 증가하는 경향이 있어, 규칙적인 아침 회상 대화와 충분한 휴식을 권장합니다.
            </Text>
          </View>
        </View>

        {/* 행동 자극 권장 케어 가이드 */}
        <Text style={styles.secTitle}>행동 자극 권장 케어 가이드</Text>
        <Text style={styles.guideLead}>이번 {period} 분석을 바탕으로 일상에서 실천하면 좋은 케어예요.</Text>
        <View style={styles.guideWrap}>
          {CARE_GUIDE.map((g) => (
            <View key={g.title} style={styles.guideCard}>
              <View style={styles.guideIcon}>
                <Feather name={g.icon} size={20} color={Caregiver.primaryDeep} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.guideTitle}>{g.title}</Text>
                <Text style={styles.guideDesc}>{g.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* PDF 내보내기 */}
        <Pressable accessibilityRole="button" accessibilityLabel="의사 상담용 요약 PDF 내보내기" onPress={() => setPreview(true)} style={({ pressed }) => [styles.pdfBtn, pressed && { opacity: 0.9 }]}>
          <Feather name="file-text" size={22} color={Caregiver.onPrimary} />
          <Text style={styles.pdfText}>의사 상담용 요약 PDF 내보내기</Text>
        </Pressable>
      </ScrollView>

      {/* PDF 미리보기 모달 */}
      <Modal visible={preview} transparent animationType="slide" onRequestClose={() => setPreview(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.previewWrap}>
            <ScrollView contentContainerStyle={styles.paperScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.paper}>
                <View style={styles.paperHead}>
                  <View style={styles.flex}>
                    <Text style={styles.paperTitle}>종합 인지 기능 일차 평가 보고서</Text>
                    <Text style={styles.paperSubEn}>Comprehensive Cognitive Assessment Report</Text>
                  </View>
                  <View style={styles.officialMark}>
                    <Text style={styles.officialMarkText}>인</Text>
                  </View>
                </View>

                <View style={styles.paperDivider} />

                <View style={styles.infoBar}>
                  <View style={styles.infoCell}>
                    <Text style={styles.infoKey}>성명</Text>
                    <Text style={styles.infoVal}>{PATIENT.name}</Text>
                  </View>
                  <View style={styles.infoCell}>
                    <Text style={styles.infoKey}>연령</Text>
                    <Text style={styles.infoVal}>{PATIENT.age}세</Text>
                  </View>
                  <View style={styles.infoCell}>
                    <Text style={styles.infoKey}>성별</Text>
                    <Text style={styles.infoVal}>{PATIENT.gender}</Text>
                  </View>
                  <View style={styles.infoCell}>
                    <Text style={styles.infoKey}>검사일</Text>
                    <Text style={styles.infoVal}>{PATIENT.date}</Text>
                  </View>
                </View>

                <Text style={styles.tableCaption}>1. 핵심 인지 지표</Text>
                <View style={styles.table}>
                  <View style={[styles.tr, styles.trHead]}>
                    <Text style={[styles.th, styles.colLabel]}>지표</Text>
                    <Text style={[styles.th, styles.colVal]}>수치</Text>
                    <Text style={[styles.th, styles.colDelta]}>변화</Text>
                  </View>
                  {KPIS.map((k, i) => (
                    <View key={k.key} style={[styles.tr, i % 2 === 1 && styles.trAlt]}>
                      <Text style={[styles.td, styles.colLabel]}>{k.label}</Text>
                      <Text style={[styles.td, styles.colVal, k.danger && styles.tdDanger]}>{k.value} {k.unit}</Text>
                      <Text style={[styles.td, styles.colDelta, k.danger && styles.tdDanger]}>{k.delta}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.tableCaption}>2. 인지 영역별 점수</Text>
                <View style={styles.table}>
                  <View style={[styles.tr, styles.trHead]}>
                    <Text style={[styles.th, styles.colLabel]}>영역</Text>
                    <Text style={[styles.th, styles.colVal]}>점수</Text>
                    <Text style={[styles.th, styles.colDelta]}>판정</Text>
                  </View>
                  {DOMAINS.map((d, i) => (
                    <View key={d.label} style={[styles.tr, i % 2 === 1 && styles.trAlt]}>
                      <Text style={[styles.td, styles.colLabel]}>{d.label}</Text>
                      <Text style={[styles.td, styles.colVal]}>{d.score}점</Text>
                      <Text style={[styles.td, styles.colDelta]}>{d.status}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.tableCaption}>3. 종합 소견</Text>
                <Text style={styles.paperOpinion}>
                  반응 지연 시간이 임계치를 초과하고 단기 기억력이 ‘주의’ 수준으로, 정기적 추적 관찰을 권장함.
                  언어 유창성·대화 참여도는 안정적으로 유지됨.
                </Text>

                <Text style={styles.paperFoot}>본 보고서는 AI 분석 기반 참고 자료이며, 진단은 전문의 소견을 따릅니다.</Text>
              </View>
            </ScrollView>

            <View style={styles.previewBtns}>
              <Pressable accessibilityRole="button" accessibilityLabel="닫기" onPress={() => setPreview(false)} style={[styles.previewBtn, styles.previewClose]}>
                <Text style={styles.previewCloseText}>닫기</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="PDF 저장 및 공유" onPress={() => setPreview(false)} style={[styles.previewBtn, styles.previewSave]}>
                <Feather name="share-2" size={20} color={Caregiver.onPrimary} />
                <Text style={styles.previewSaveText}>PDF 저장 및 공유</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Caregiver.bg },
  flex: { flex: 1 },

  header: { minHeight: 64, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 72 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Caregiver.text },

  tabs: { flexDirection: 'row', gap: 6, marginHorizontal: 22, marginTop: 4, padding: 5, borderRadius: 16, backgroundColor: Caregiver.surfaceAlt },
  tab: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: Caregiver.primaryDeep },
  tabText: { fontSize: 16, fontWeight: '700', color: Caregiver.textSub },
  tabTextOn: { color: Caregiver.onPrimary, fontWeight: '800' },

  content: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 28 },
  secTitle: { fontSize: 18, fontWeight: '800', color: Caregiver.text, marginTop: 22, marginBottom: 12 },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpiCard: { width: '47.5%', flexGrow: 1, borderRadius: 16, padding: 16, backgroundColor: Caregiver.surface, borderWidth: 1.5, borderColor: Caregiver.borderSoft },
  kpiCardDanger: { borderColor: SOFT_RED, backgroundColor: SOFT_RED_BG },
  kpiTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kpiBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 8, height: 22, borderRadius: 11 },
  kpiBadgeText: { fontSize: 12, fontWeight: '800' },
  kpiValue: { fontSize: 30, fontWeight: '800', color: Caregiver.text, marginTop: 12 },
  kpiUnit: { fontSize: 15, fontWeight: '700', color: Caregiver.textSub },
  kpiLabel: { fontSize: 14, fontWeight: '600', color: Caregiver.textSub, marginTop: 2 },

  card: { borderRadius: 18, padding: 18, backgroundColor: Caregiver.surface, borderWidth: 1, borderColor: Caregiver.borderSoft },

  legendRow: { flexDirection: 'row', gap: 18, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 14, fontWeight: '700', color: Caregiver.textSub },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 150, gap: 4 },
  chartCol: { flex: 1, alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 3, height: 118 },
  dualBar: { width: 9, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  chartX: { fontSize: 12, fontWeight: '700', color: Caregiver.textSub },

  domain: { marginVertical: 8 },
  domainTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  domainLabel: { fontSize: 16, fontWeight: '700', color: Caregiver.text },
  domainRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusBadge: { paddingHorizontal: 10, height: 24, borderRadius: 12, justifyContent: 'center' },
  statusText: { fontSize: 12, fontWeight: '800' },
  domainScore: { fontSize: 16, fontWeight: '800', color: Caregiver.text, width: 28, textAlign: 'right' },
  gaugeTrack: { width: '100%', height: 12, borderRadius: 6, backgroundColor: Caregiver.surfaceDeep, overflow: 'hidden' },
  gaugeFill: { height: '100%', borderRadius: 6 },

  opinionCard: { flexDirection: 'row', borderRadius: 18, padding: 18, backgroundColor: Caregiver.surfaceAlt, overflow: 'hidden' },
  opinionGuide: { width: 4, borderRadius: 2, backgroundColor: Caregiver.primary, marginRight: 14 },
  opinionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  opinionTitle: { fontSize: 16, fontWeight: '800', color: Caregiver.primaryDeep },
  opinionText: { fontSize: 16, fontWeight: '500', color: Caregiver.text, lineHeight: 25 },

  guideLead: { fontSize: 15, fontWeight: '500', color: Caregiver.textSub, marginTop: -4, marginBottom: 12, lineHeight: 22 },
  guideWrap: { gap: 12 },
  guideCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, backgroundColor: Caregiver.surface, borderWidth: 1, borderColor: Caregiver.borderSoft },
  guideIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: Caregiver.primarySoft, alignItems: 'center', justifyContent: 'center' },
  guideTitle: { fontSize: 16, fontWeight: '800', color: Caregiver.text },
  guideDesc: { fontSize: 14, fontWeight: '500', color: Caregiver.textSub, marginTop: 3, lineHeight: 20 },

  pdfBtn: { flexDirection: 'row', gap: 10, minHeight: 60, borderRadius: 18, backgroundColor: Caregiver.primaryDeep, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  pdfText: { fontSize: 18, fontWeight: '800', color: Caregiver.onPrimary },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(28,40,51,0.6)', paddingTop: 60, paddingBottom: 24, paddingHorizontal: 16 },
  previewWrap: { flex: 1 },
  paperScroll: { paddingBottom: 16 },
  paper: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 22 },
  paperHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  paperTitle: { fontSize: 18, fontWeight: '800', color: '#1C2833' },
  paperSubEn: { fontSize: 12, fontWeight: '600', color: '#7F8C9B', marginTop: 4 },
  officialMark: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: SOFT_RED, alignItems: 'center', justifyContent: 'center' },
  officialMarkText: { fontSize: 20, fontWeight: '800', color: SOFT_RED },
  paperDivider: { height: 2, backgroundColor: '#1C2833', marginVertical: 16 },

  infoBar: { flexDirection: 'row', borderWidth: 1, borderColor: '#D9E6F2', borderRadius: 8, overflow: 'hidden' },
  infoCell: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E8EFF6' },
  infoKey: { fontSize: 11, fontWeight: '700', color: '#7F8C9B' },
  infoVal: { fontSize: 15, fontWeight: '800', color: '#1C2833', marginTop: 3 },

  tableCaption: { fontSize: 15, fontWeight: '800', color: '#1C2833', marginTop: 22, marginBottom: 10 },
  table: { borderWidth: 1, borderColor: '#D9E6F2', borderRadius: 8, overflow: 'hidden' },
  tr: { flexDirection: 'row', minHeight: 40, alignItems: 'center' },
  trHead: { backgroundColor: '#E8F1FA' },
  trAlt: { backgroundColor: '#F7FAFD' },
  th: { fontSize: 13, fontWeight: '800', color: '#1C2833', paddingHorizontal: 12 },
  td: { fontSize: 14, fontWeight: '600', color: '#1C2833', paddingHorizontal: 12, paddingVertical: 8 },
  tdDanger: { color: SOFT_RED, fontWeight: '800' },
  colLabel: { flex: 2 },
  colVal: { flex: 1, textAlign: 'center' },
  colDelta: { flex: 1, textAlign: 'center' },

  paperOpinion: { fontSize: 14, fontWeight: '500', color: '#1C2833', lineHeight: 23 },
  paperFoot: { fontSize: 12, fontWeight: '500', color: '#7F8C9B', marginTop: 22, lineHeight: 18 },

  previewBtns: { flexDirection: 'row', gap: 12, paddingTop: 12 },
  previewBtn: { flex: 1, flexDirection: 'row', gap: 8, minHeight: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  previewClose: { backgroundColor: Caregiver.surface, borderWidth: 1.5, borderColor: Caregiver.border },
  previewCloseText: { fontSize: 18, fontWeight: '800', color: Caregiver.textSub },
  previewSave: { backgroundColor: Caregiver.primaryDeep },
  previewSaveText: { fontSize: 18, fontWeight: '800', color: Caregiver.onPrimary },
});
