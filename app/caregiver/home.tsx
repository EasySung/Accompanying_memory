/**
 * caregiver/home — 실시간 대시보드 메인
 *  - 대화 타임라인: 전체폭 음성 재생 바 + 재생 진행 애니메이션(setInterval).
 *  - 감정 비율: Feather 라인 표정 아이콘 + 컴팩트 가로 바.
 *  - '정보 수정' 모달: 환자 기본 정보(이름/나이/호칭) + 10가지 회상 질문 전체 조회·수정.
 *  - 아이콘은 Feather 라인 아이콘으로 통일.
 */

import BackButton from '@/components/BackButton';
import { Caregiver } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RISK_DETECTED = true;
const KEYWORDS = ['고향', '어머니', '바닷가', '막내'];

/** 추억 입력 단계의 10가지 회상 질문 제목 */
const MEMORY_LABELS = [
  '어린 시절의 고향',
  '잊지 못할 음식',
  '청춘의 멜로디',
  '학창 시절의 벗',
  '자랑스러운 순간',
  '행복했던 가족 여행',
  '소중한 취미',
  '감사한 인연',
  '새 생명의 기쁨',
  '나만의 보물',
];

type Emotion = { label: string; icon: React.ComponentProps<typeof Feather>['name']; pct: number; color: string };
const EMOTIONS: Emotion[] = [
  { label: '기쁨', icon: 'smile', pct: 42, color: Caregiver.joy },
  { label: '평온', icon: 'meh', pct: 33, color: Caregiver.calm },
  { label: '혼란', icon: 'help-circle', pct: 15, color: Caregiver.confusion },
  { label: '우울', icon: 'frown', pct: 10, color: Caregiver.sad },
];

export default function CaregiverHome() {
  const router = useRouter();

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [editing, setEditing] = useState(false);
  const [patientName, setPatientName] = useState('김순자');
  const [patientAge, setPatientAge] = useState('82');
  const [callName, setCallName] = useState('할머니');
  const [memoryAnswers, setMemoryAnswers] = useState<string[]>(() => {
    const a = Array(MEMORY_LABELS.length).fill('');
    a[0] = '뒷산 진달래와 앞개울';
    a[1] = '갈치조림';
    a[5] = '제주도 가족 여행';
    return a;
  });

  const updateMemory = (i: number, t: string) =>
    setMemoryAnswers((prev) => {
      const next = [...prev];
      next[i] = t;
      return next;
    });

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          clearInterval(id);
          setPlaying(false);
          return 1;
        }
        return Math.min(1, p + 0.02);
      });
    }, 100);
    return () => clearInterval(id);
  }, [playing]);

  const togglePlay = () => {
    if (progress >= 1) setProgress(0);
    setPlaying((v) => !v);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackButton bg={Caregiver.surfaceAlt} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.flex}>
            <Text style={styles.hello}>{patientName} {callName}</Text>
            <Text style={styles.helloSub}>오늘도 평온한 하루예요</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="정보 수정" onPress={() => setEditing(true)} style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.9 }]}>
            <Feather name="edit-3" size={18} color={Caregiver.primaryDeep} />
            <Text style={styles.editText}>정보 수정</Text>
          </Pressable>
        </View>

        <View style={styles.doneBanner}>
          <View style={styles.doneCheck}>
            <Feather name="check" size={18} color={Caregiver.primaryDeep} />
          </View>
          <Text style={styles.doneText}>오늘 오전 10시 대화 완료</Text>
          <Feather name="phone" size={20} color={Caregiver.onPrimary} />
        </View>

        {RISK_DETECTED && (
          <Pressable accessibilityRole="button" accessibilityLabel="위험 징후 알림 보기" onPress={() => router.push('/caregiver/alerts')} style={({ pressed }) => [styles.riskBanner, pressed && { opacity: 0.92 }]}>
            <View style={styles.riskIcon}>
              <Feather name="alert-triangle" size={22} color={Caregiver.danger} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.riskTitle}>혼란 징후가 감지됐어요</Text>
              <Text style={styles.riskSub}>오전 대화에서 같은 질문 3회 · 자세히 보기</Text>
            </View>
            <Feather name="chevron-right" size={24} color={Caregiver.danger} />
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>오늘의 대화</Text>
        <View style={styles.card}>
          <View style={styles.timelineTop}>
            <View style={styles.timeDot} />
            <Text style={styles.timeLabel}>오전 10:00 · 회상 대화</Text>
          </View>
          <Text style={styles.summary}>
            김순자 할머니께서 고향과 바닷가 추억을 즐겁게 떠올리셨어요. 막내 이야기에 특히 환하게 웃으셨습니다.
          </Text>

          <View style={styles.playerRow}>
            <Pressable accessibilityRole="button" accessibilityLabel={playing ? '일시정지' : '재생'} onPress={togglePlay} style={styles.playBtn}>
              <Feather name={playing ? 'pause' : 'play'} size={20} color={Caregiver.onPrimary} />
            </Pressable>
            <Text style={styles.playTime}>{playing ? '재생 중' : '음성 다시듣기'}</Text>
          </View>
          <View style={styles.audioTrack}>
            <View style={[styles.audioFill, { width: `${progress * 100}%` }]} />
            <View style={[styles.audioThumb, { left: `${progress * 100}%` }]} />
          </View>
          <View style={styles.audioMeta}>
            <Text style={styles.audioMetaText}>{Math.round(progress * 204)}초</Text>
            <Text style={styles.audioMetaText}>3:24</Text>
          </View>

          <View style={styles.kwWrap}>
            {KEYWORDS.map((k) => (
              <View key={k} style={styles.kw}>
                <Text style={styles.kwText}>#{k}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>오늘 감정 비율</Text>
        <View style={styles.card}>
          {EMOTIONS.map((e) => (
            <View key={e.label} style={styles.emoRow}>
              <Feather name={e.icon} size={22} color={e.color} style={styles.emoIcon} />
              <Text style={styles.emoLabel}>{e.label}</Text>
              <View style={styles.emoBarTrack}>
                <View style={[styles.emoBarFill, { width: `${e.pct}%`, backgroundColor: e.color }]} />
              </View>
              <Text style={styles.emoPct}>{e.pct}%</Text>
            </View>
          ))}
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="분석 리포트" onPress={() => router.push('/caregiver/report')} style={({ pressed }) => [styles.reportLink, pressed && { opacity: 0.92 }]}>
          <Feather name="bar-chart-2" size={22} color={Caregiver.primaryDeep} />
          <Text style={styles.reportText}>인지 변화 분석 리포트 보기</Text>
          <Feather name="chevron-right" size={22} color={Caregiver.primaryDeep} />
        </Pressable>
      </ScrollView>

      {/* 정보 수정 모달 */}
      <Modal visible={editing} transparent animationType="slide" onRequestClose={() => setEditing(false)}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.modalCard}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>정보 수정</Text>
              <Text style={styles.modalSub}>등록한 환자 정보와 10가지 추억 데이터를 모두 수정할 수 있어요.</Text>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.modalSection}>환자 정보</Text>
                <Text style={styles.modalLabel}>환자 이름</Text>
                <TextInput style={styles.modalInput} value={patientName} onChangeText={setPatientName} placeholderTextColor={Caregiver.textSub} />
                <Text style={styles.modalLabel}>나이</Text>
                <TextInput style={styles.modalInput} value={patientAge} onChangeText={setPatientAge} keyboardType="number-pad" placeholderTextColor={Caregiver.textSub} />
                <Text style={styles.modalLabel}>AI가 부를 호칭</Text>
                <TextInput style={styles.modalInput} value={callName} onChangeText={setCallName} placeholderTextColor={Caregiver.textSub} />

                <Text style={styles.modalSection}>추억 데이터 (10문항)</Text>
                {MEMORY_LABELS.map((label, i) => (
                  <View key={label}>
                    <Text style={styles.modalLabel}>{i + 1}. {label}</Text>
                    <TextInput
                      style={[styles.modalInput, styles.modalArea]}
                      value={memoryAnswers[i]}
                      onChangeText={(t) => updateMemory(i, t)}
                      placeholder="기억나시는 내용을 적어주세요"
                      placeholderTextColor={Caregiver.textSub}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalBtns}>
                <Pressable accessibilityRole="button" accessibilityLabel="닫기" onPress={() => setEditing(false)} style={[styles.modalBtn, styles.modalClose]}>
                  <Text style={styles.modalCloseText}>닫기</Text>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="저장" onPress={() => setEditing(false)} style={[styles.modalBtn, styles.modalSaveBtn]}>
                  <Text style={styles.modalSaveText}>저장</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Caregiver.bg },
  flex: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 88, paddingBottom: 28 },

  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  hello: { fontSize: 26, fontWeight: '800', color: Caregiver.text },
  helloSub: { fontSize: 16, fontWeight: '500', color: Caregiver.textSub, marginTop: 2 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 44, borderRadius: 22, backgroundColor: Caregiver.surfaceAlt, borderWidth: 1.5, borderColor: Caregiver.border },
  editText: { fontSize: 15, fontWeight: '800', color: Caregiver.primaryDeep },

  doneBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: Caregiver.primaryDeep },
  doneCheck: { width: 32, height: 32, borderRadius: 16, backgroundColor: Caregiver.onPrimary, alignItems: 'center', justifyContent: 'center' },
  doneText: { flex: 1, fontSize: 18, fontWeight: '800', color: Caregiver.onPrimary },

  riskBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: Caregiver.dangerSoft, borderWidth: 1.5, borderColor: Caregiver.danger, marginTop: 12 },
  riskIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Caregiver.white, alignItems: 'center', justifyContent: 'center' },
  riskTitle: { fontSize: 17, fontWeight: '800', color: Caregiver.text },
  riskSub: { fontSize: 14, fontWeight: '500', color: Caregiver.textSub, marginTop: 2 },

  sectionTitle: { fontSize: 19, fontWeight: '800', color: Caregiver.text, marginTop: 26, marginBottom: 12 },

  card: { borderRadius: 18, padding: 18, backgroundColor: Caregiver.surface, borderWidth: 1, borderColor: Caregiver.borderSoft },
  timelineTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  timeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Caregiver.primary },
  timeLabel: { fontSize: 15, fontWeight: '800', color: Caregiver.primaryDeep },
  summary: { fontSize: 17, fontWeight: '500', color: Caregiver.text, lineHeight: 26 },

  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  playBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Caregiver.primary, alignItems: 'center', justifyContent: 'center' },
  playTime: { fontSize: 14, fontWeight: '700', color: Caregiver.textSub },
  audioTrack: { width: '100%', height: 8, borderRadius: 4, backgroundColor: Caregiver.surfaceDeep, marginTop: 12, justifyContent: 'center' },
  audioFill: { position: 'absolute', left: 0, height: 8, borderRadius: 4, backgroundColor: Caregiver.primary },
  audioThumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: Caregiver.primaryDeep, marginLeft: -8 },
  audioMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  audioMetaText: { fontSize: 13, fontWeight: '600', color: Caregiver.textSub },

  kwWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  kw: { height: 34, paddingHorizontal: 12, borderRadius: 17, backgroundColor: Caregiver.primarySoft, justifyContent: 'center' },
  kwText: { fontSize: 14, fontWeight: '800', color: Caregiver.primaryDeep },

  emoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 7 },
  emoIcon: { width: 28, textAlign: 'center' },
  emoLabel: { fontSize: 15, fontWeight: '700', color: Caregiver.text, width: 38 },
  emoBarTrack: { flex: 1, height: 14, borderRadius: 7, backgroundColor: Caregiver.surfaceDeep, overflow: 'hidden' },
  emoBarFill: { height: '100%', borderRadius: 7 },
  emoPct: { fontSize: 15, fontWeight: '800', color: Caregiver.text, width: 42, textAlign: 'right' },

  reportLink: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 60, paddingHorizontal: 18, borderRadius: 16, backgroundColor: Caregiver.surface, borderWidth: 1.5, borderColor: Caregiver.border, marginTop: 24 },
  reportText: { flex: 1, fontSize: 17, fontWeight: '800', color: Caregiver.text },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(28,40,51,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Caregiver.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 24, maxHeight: '92%' },
  modalHandle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: Caregiver.surfaceDeep, marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: Caregiver.text },
  modalSub: { fontSize: 15, fontWeight: '500', color: Caregiver.textSub, marginTop: 6, marginBottom: 6 },
  modalScroll: { flexGrow: 0 },
  modalSection: { fontSize: 16, fontWeight: '800', color: Caregiver.primaryDeep, marginTop: 18, marginBottom: 4 },
  modalLabel: { fontSize: 14, fontWeight: '800', color: Caregiver.textSub, marginTop: 12, marginBottom: 7 },
  modalInput: { minHeight: 52, paddingHorizontal: 14, borderRadius: 12, backgroundColor: Caregiver.surfaceAlt, borderWidth: 1.5, borderColor: Caregiver.border, fontSize: 16, fontWeight: '700', color: Caregiver.text },
  modalArea: { minHeight: 60, paddingTop: 12, fontWeight: '500' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 18 },
  modalBtn: { flex: 1, minHeight: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modalClose: { backgroundColor: Caregiver.surfaceAlt, borderWidth: 1.5, borderColor: Caregiver.border },
  modalCloseText: { fontSize: 18, fontWeight: '800', color: Caregiver.textSub },
  modalSaveBtn: { backgroundColor: Caregiver.primaryDeep },
  modalSaveText: { fontSize: 18, fontWeight: '800', color: Caregiver.onPrimary },
});
