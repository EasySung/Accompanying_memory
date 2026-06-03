/**
 * caregiver/onboarding — 온보딩 및 초기 설정 (3단계)
 *  - [1] 환자 기본 정보 · [2] AI 호칭 매핑 + 치매 단계 · [3] 선제 대화 예약
 *  - 좌측 상단 공용 뒤로가기 / 단계 이동은 하단 '이전' 버튼.
 *  - 아이콘은 Feather 라인 아이콘으로 통일.
 */

import BackButton from '@/components/BackButton';
import { Caregiver } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_STEPS = 3;

const CALL_OPTIONS = ['할머니', '할아버지', '어머니', '아버지', '어르신'];
const SELF_OPTIONS = ['딸', '아들', '손주', '며느리', '사위'];
const RESERVE_TIMES = ['오전 9시', '오전 10시', '오후 2시', '오후 7시'];

type Stage = {
  key: 'mci' | 'early';
  title: string;
  desc: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

const STAGES: Stage[] = [
  { key: 'mci', title: '경도인지장애', desc: 'MCI · 일상생활은 가능하나 기억 저하가 시작', icon: 'activity' },
  { key: 'early', title: '초기 치매', desc: '간헐적 혼란·반복 질문이 나타나는 단계', icon: 'alert-circle' },
];

type DropdownProps = {
  label: string;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
};

function Dropdown({ label, value, options, open, onToggle, onSelect }: DropdownProps) {
  return (
    <View style={styles.ddWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={onToggle} style={[styles.ddHead, open && styles.ddHeadOpen]}>
        <Text style={styles.ddValue}>{value}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={22} color={Caregiver.primaryDeep} />
      </Pressable>
      {open && (
        <View style={styles.ddList}>
          {options.map((o) => {
            const on = o === value;
            return (
              <Pressable key={o} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => onSelect(o)} style={[styles.ddItem, on && styles.ddItemOn]}>
                <Text style={[styles.ddItemText, on && styles.ddItemTextOn]}>{o}</Text>
                {on && <Feather name="check" size={20} color={Caregiver.primaryDeep} />}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [name, setName] = useState('김순자');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'female' | 'male' | null>(null);

  const [callName, setCallName] = useState('할머니');
  const [selfName, setSelfName] = useState('딸');
  const [openDd, setOpenDd] = useState<'call' | 'self' | null>(null);
  const [stage, setStage] = useState<Stage['key'] | null>(null);

  const [reserve, setReserve] = useState<string | null>(null);

  const progress = (step + 1) / TOTAL_STEPS;

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setOpenDd(null);
      setStep((v) => v + 1);
    } else {
      router.replace('/caregiver/memory-input');
    }
  };

  const goPrevStep = () => {
    setOpenDd(null);
    setStep((v) => Math.max(0, v - 1));
  };

  const STEP_TITLE = ['환자 기본 정보', 'AI 호칭 & 치매 단계', 'AI 선제 대화 예약'][step];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackButton bg={Caregiver.surfaceAlt} />
      <View style={styles.header}>
        <Text style={styles.stepCount}>{step + 1} / {TOTAL_STEPS}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{STEP_TITLE}</Text>

          {step === 0 && (
            <>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>환자 이름</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="예) 김순자" placeholderTextColor={Caregiver.textSub} />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>나이</Text>
                <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="예) 78" placeholderTextColor={Caregiver.textSub} keyboardType="number-pad" />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>성별</Text>
                <View style={styles.seg}>
                  {(['female', 'male'] as const).map((g) => {
                    const on = gender === g;
                    return (
                      <Pressable key={g} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setGender(g)} style={[styles.segItem, on && styles.segItemOn]}>
                        <Feather name="user" size={20} color={on ? Caregiver.onPrimary : Caregiver.textSub} />
                        <Text style={[styles.segText, on && styles.segTextOn]}>{g === 'female' ? '여성' : '남성'}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </>
          )}

          {step === 1 && (
            <>
              <View style={styles.note}>
                <Feather name="info" size={20} color={Caregiver.primaryDeep} />
                <Text style={styles.noteText}>AI가 환자를 {`"${callName}"`}(으)로 부르고, 자신을 {`"${selfName}"`}(으)로 소개해요.</Text>
              </View>
              <Dropdown label="AI가 환자를 부르는 호칭" value={callName} options={CALL_OPTIONS} open={openDd === 'call'} onToggle={() => setOpenDd((p) => (p === 'call' ? null : 'call'))} onSelect={(v) => { setCallName(v); setOpenDd(null); }} />
              <Dropdown label="AI가 자신을 칭하는 호칭" value={selfName} options={SELF_OPTIONS} open={openDd === 'self'} onToggle={() => setOpenDd((p) => (p === 'self' ? null : 'self'))} onSelect={(v) => { setSelfName(v); setOpenDd(null); }} />

              <Text style={[styles.fieldLabel, { marginTop: 24 }]}>치매 단계</Text>
              <View style={styles.stageWrap}>
                {STAGES.map((s) => {
                  const on = stage === s.key;
                  return (
                    <Pressable key={s.key} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setStage(s.key)} style={[styles.stageCard, on && styles.stageCardOn]}>
                      <View style={[styles.stageIcon, on && styles.stageIconOn]}>
                        <Feather name={s.icon} size={26} color={on ? Caregiver.onPrimary : Caregiver.primaryDeep} />
                      </View>
                      <Text style={[styles.stageTitle, on && { color: Caregiver.primaryDeep }]}>{s.title}</Text>
                      <Text style={styles.stageDesc}>{s.desc}</Text>
                      {on && (
                        <View style={styles.stageCheck}>
                          <Feather name="check-circle" size={24} color={Caregiver.primaryDeep} />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.lead}>AI가 매일 이 시간에 먼저 전화를 걸어 안부를 묻고 회상 대화를 시작해요.</Text>
              <View style={styles.timeGrid}>
                {RESERVE_TIMES.map((t) => {
                  const on = reserve === t;
                  return (
                    <Pressable key={t} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setReserve(t)} style={[styles.timeCard, on && styles.timeCardOn]}>
                      <Feather name="clock" size={24} color={on ? Caregiver.onPrimary : Caregiver.primaryDeep} />
                      <Text style={[styles.timeText, on && styles.timeTextOn]}>{t}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            {step > 0 && (
              <Pressable accessibilityRole="button" accessibilityLabel="이전 단계" onPress={goPrevStep} style={({ pressed }) => [styles.prevBtn, pressed && { opacity: 0.9 }]}>
                <Feather name="chevron-left" size={22} color={Caregiver.primaryDeep} />
                <Text style={styles.prevText}>이전</Text>
              </Pressable>
            )}
            <Pressable accessibilityRole="button" accessibilityLabel={step === TOTAL_STEPS - 1 ? '설정 완료' : '다음'} onPress={goNext} style={({ pressed }) => [styles.cta, styles.ctaFlex, pressed && { opacity: 0.9 }]}>
              <Text style={styles.ctaText}>{step === TOTAL_STEPS - 1 ? '설정 완료' : '다음'}</Text>
              <Feather name={step === TOTAL_STEPS - 1 ? 'check' : 'arrow-right'} size={22} color={Caregiver.onPrimary} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Caregiver.bg },
  flex: { flex: 1 },

  header: { minHeight: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 72 },
  stepCount: { fontSize: 16, fontWeight: '800', color: Caregiver.primaryDeep },
  progressTrack: { height: 8, marginHorizontal: 22, borderRadius: 4, backgroundColor: Caregiver.surfaceDeep, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: Caregiver.primary },

  content: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: Caregiver.text, marginBottom: 22, letterSpacing: -0.5 },
  lead: { fontSize: 17, fontWeight: '500', color: Caregiver.textSub, lineHeight: 25, marginBottom: 20 },

  field: { marginBottom: 20 },
  fieldLabel: { fontSize: 15, fontWeight: '800', color: Caregiver.textSub, marginBottom: 8 },
  input: { minHeight: 56, paddingHorizontal: 16, borderRadius: 14, backgroundColor: Caregiver.surface, borderWidth: 1.5, borderColor: Caregiver.border, fontSize: 18, fontWeight: '700', color: Caregiver.text },

  seg: { flexDirection: 'row', gap: 12 },
  segItem: { flex: 1, flexDirection: 'row', gap: 8, minHeight: 56, borderRadius: 14, backgroundColor: Caregiver.surface, borderWidth: 1.5, borderColor: Caregiver.border, alignItems: 'center', justifyContent: 'center' },
  segItemOn: { backgroundColor: Caregiver.primary, borderColor: Caregiver.primary },
  segText: { fontSize: 17, fontWeight: '700', color: Caregiver.textSub },
  segTextOn: { color: Caregiver.onPrimary },

  note: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 14, borderRadius: 14, backgroundColor: Caregiver.primarySoft, marginBottom: 20 },
  noteText: { flex: 1, fontSize: 15, fontWeight: '600', color: Caregiver.primaryDeep, lineHeight: 22 },

  ddWrap: { marginBottom: 16 },
  ddHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56, paddingHorizontal: 16, borderRadius: 14, backgroundColor: Caregiver.surface, borderWidth: 1.5, borderColor: Caregiver.border },
  ddHeadOpen: { borderColor: Caregiver.primary },
  ddValue: { fontSize: 18, fontWeight: '700', color: Caregiver.text },
  ddList: { marginTop: 8, borderRadius: 14, backgroundColor: Caregiver.surface, borderWidth: 1.5, borderColor: Caregiver.border, overflow: 'hidden' },
  ddItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, paddingHorizontal: 16 },
  ddItemOn: { backgroundColor: Caregiver.primarySoft },
  ddItemText: { fontSize: 17, fontWeight: '600', color: Caregiver.text },
  ddItemTextOn: { fontWeight: '800', color: Caregiver.primaryDeep },

  stageWrap: { gap: 12, marginTop: 10 },
  stageCard: { borderRadius: 18, padding: 18, backgroundColor: Caregiver.surface, borderWidth: 2, borderColor: Caregiver.border },
  stageCardOn: { borderColor: Caregiver.primary, backgroundColor: Caregiver.primarySoft },
  stageIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: Caregiver.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  stageIconOn: { backgroundColor: Caregiver.primary },
  stageTitle: { fontSize: 20, fontWeight: '800', color: Caregiver.text },
  stageDesc: { fontSize: 15, fontWeight: '500', color: Caregiver.textSub, marginTop: 4, lineHeight: 21 },
  stageCheck: { position: 'absolute', top: 16, right: 16 },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  timeCard: { width: '47%', flexGrow: 1, flexDirection: 'row', gap: 10, minHeight: 64, borderRadius: 16, backgroundColor: Caregiver.surface, borderWidth: 2, borderColor: Caregiver.border, alignItems: 'center', justifyContent: 'center' },
  timeCardOn: { backgroundColor: Caregiver.primary, borderColor: Caregiver.primary },
  timeText: { fontSize: 18, fontWeight: '800', color: Caregiver.text },
  timeTextOn: { color: Caregiver.onPrimary },

  footer: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16 },
  footerRow: { flexDirection: 'row', gap: 12 },
  prevBtn: { flexDirection: 'row', gap: 4, minHeight: 60, paddingHorizontal: 20, borderRadius: 18, backgroundColor: Caregiver.surfaceAlt, borderWidth: 1.5, borderColor: Caregiver.border, alignItems: 'center', justifyContent: 'center' },
  prevText: { fontSize: 18, fontWeight: '800', color: Caregiver.primaryDeep },
  cta: { flexDirection: 'row', gap: 10, minHeight: 60, borderRadius: 18, backgroundColor: Caregiver.primaryDeep, alignItems: 'center', justifyContent: 'center' },
  ctaFlex: { flex: 1 },
  ctaText: { fontSize: 20, fontWeight: '800', color: Caregiver.onPrimary },
});
