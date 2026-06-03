/**
 * caregiver/alerts — 위험 징후 알림 및 행동 지침
 *  - 우울 지표 증가 · BPSD 혼란 감지 · 대화 참여도 감소 경고 로그.
 *  - 카드 터치 시 아코디언으로 행동 지침 표출.
 *  - 하단 '치매안심센터 상담 전화 바로 연결'(Linking).
 *  - 아이콘은 Feather 라인 아이콘으로 통일.
 */

import BackButton from '@/components/BackButton';
import { Caregiver } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HELP_LINE = '1899-9988';

type Level = 'danger' | 'warning' | 'info';

type Alert = {
  id: string;
  level: Level;
  title: string;
  desc: string;
  time: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  tips: string[];
};

const ALERTS: Alert[] = [
  {
    id: '1',
    level: 'danger',
    title: '우울 지표가 증가했어요',
    desc: '최근 3일간 부정 감정 표현이 평소보다 38% 늘었어요.',
    time: '오늘 오전 10:05',
    icon: 'frown',
    tips: [
      '날씨 좋은 날 함께 짧은 산책으로 기분을 환기해 주세요.',
      '과거의 즐거운 추억(사진·음악)을 함께 보며 대화해 주세요.',
      '2주 이상 지속되면 전문의 상담을 권장해요.',
    ],
  },
  {
    id: '2',
    level: 'warning',
    title: 'BPSD 혼란이 감지됐어요',
    desc: '오전 대화에서 같은 질문을 3회 반복했어요.',
    time: '오늘 오전 9:42',
    icon: 'help-circle',
    tips: [
      '다그치지 말고 차분한 목소리로 같은 답을 반복해 주세요.',
      '시간·장소를 알려주는 큰 달력과 시계를 잘 보이는 곳에 두세요.',
      '혼란이 심한 시간대를 기록해 패턴을 파악해 주세요.',
    ],
  },
  {
    id: '3',
    level: 'info',
    title: '대화 참여도가 감소했어요',
    desc: '평균 응답 길이가 지난주보다 짧아졌어요.',
    time: '어제 오후 7:30',
    icon: 'message-square',
    tips: [
      '예/아니오로 답할 수 있는 쉬운 질문부터 시작해 주세요.',
      '관심 있어 하던 주제(고향·가족)로 대화를 유도해 주세요.',
    ],
  },
];

const LEVEL_STYLE: Record<Level, { color: string; soft: string; label: string }> = {
  danger: { color: Caregiver.danger, soft: Caregiver.dangerSoft, label: '주의' },
  warning: { color: Caregiver.warning, soft: Caregiver.warningSoft, label: '관찰' },
  info: { color: Caregiver.primary, soft: Caregiver.primarySoft, label: '참고' },
};

export default function Alerts() {
  const [openId, setOpenId] = useState<string | null>('1');

  const callHelpLine = () => {
    Linking.openURL(`tel:${HELP_LINE}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackButton bg={Caregiver.surfaceAlt} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>위험 징후 알림</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>AI가 살펴본 오늘의 신호예요. 카드를 누르면 행동 지침을 볼 수 있어요.</Text>

        {ALERTS.map((a) => {
          const lv = LEVEL_STYLE[a.level];
          const open = openId === a.id;
          return (
            <View key={a.id} style={styles.card}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpenId(open ? null : a.id)} style={styles.cardHead}>
                <View style={[styles.itemIcon, { backgroundColor: lv.soft }]}>
                  <Feather name={a.icon} size={22} color={lv.color} />
                </View>
                <View style={styles.flex}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{a.title}</Text>
                    <View style={[styles.tag, { backgroundColor: lv.soft }]}>
                      <Text style={[styles.tagText, { color: lv.color }]}>{lv.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemDesc}>{a.desc}</Text>
                  <Text style={styles.itemTime}>{a.time}</Text>
                </View>
                <Feather name={open ? 'chevron-up' : 'chevron-down'} size={24} color={Caregiver.textSub} />
              </Pressable>

              {open && (
                <View style={styles.tips}>
                  <Text style={styles.tipsHead}>이렇게 해보세요</Text>
                  {a.tips.map((t, i) => (
                    <View key={i} style={styles.tipRow}>
                      <View style={[styles.tipNum, { backgroundColor: lv.color }]}>
                        <Text style={styles.tipNumText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.tipText}>{t}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable accessibilityRole="button" accessibilityLabel="치매안심센터 상담 전화 바로 연결" onPress={callHelpLine} style={({ pressed }) => [styles.callBtn, pressed && { opacity: 0.9 }]}>
          <Feather name="phone-call" size={22} color={Caregiver.onPrimary} />
          <Text style={styles.callText}>치매안심센터 상담 전화 연결</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Caregiver.bg },
  flex: { flex: 1 },

  header: { minHeight: 64, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 72 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Caregiver.text },

  content: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 20, gap: 12 },
  lead: { fontSize: 16, fontWeight: '500', color: Caregiver.textSub, lineHeight: 24, marginBottom: 4 },

  card: { borderRadius: 18, backgroundColor: Caregiver.surface, borderWidth: 1, borderColor: Caregiver.borderSoft, overflow: 'hidden' },
  cardHead: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', padding: 16 },
  itemIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: Caregiver.text },
  tag: { paddingHorizontal: 10, height: 26, borderRadius: 13, justifyContent: 'center' },
  tagText: { fontSize: 13, fontWeight: '800' },
  itemDesc: { fontSize: 15, fontWeight: '500', color: Caregiver.textSub, marginTop: 4, lineHeight: 22 },
  itemTime: { fontSize: 13, fontWeight: '600', color: Caregiver.textSub, marginTop: 8, opacity: 0.8 },

  tips: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 4, borderTopWidth: 1, borderTopColor: Caregiver.borderSoft, marginHorizontal: 16, marginBottom: 4 },
  tipsHead: { fontSize: 15, fontWeight: '800', color: Caregiver.primaryDeep, marginTop: 12, marginBottom: 10 },
  tipRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
  tipNum: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  tipNumText: { fontSize: 13, fontWeight: '800', color: Caregiver.onPrimary },
  tipText: { flex: 1, fontSize: 16, fontWeight: '500', color: Caregiver.text, lineHeight: 23 },

  footer: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16 },
  callBtn: { flexDirection: 'row', gap: 10, minHeight: 60, borderRadius: 18, backgroundColor: Caregiver.primaryDeep, alignItems: 'center', justifyContent: 'center' },
  callText: { fontSize: 18, fontWeight: '800', color: Caregiver.onPrimary },
});
