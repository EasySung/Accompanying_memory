/**
 * caregiver/memory-input — 환자 정보 및 추억 입력 (10문항 회상 폼)
 *  - 장기 기억 자극용 10가지 고정 질문 리스트(제목 + 입력창, 모두 선택 입력).
 *  - 하단: 사진 다중 업로드 + 관계 인물 해시태그 + 기억 데이터 생성(임베딩 오버레이) → home.
 *  - 아이콘은 Feather 라인 아이콘으로 통일.
 */

import BackButton from '@/components/BackButton';
import { Caregiver } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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

const PHOTO_TINTS = ['#A1C4FD', '#FBC2EB', '#A8EDEA', '#FDDB92'];

export const MEMORY_QUESTIONS: { title: string; q: string }[] = [
  { title: '어린 시절의 고향', q: '가장 기억에 남는 어릴 적 고향의 풍경이나 장소는 어디인가요?' },
  { title: '잊지 못할 음식', q: '가장 좋아하시는 음식이나, 특별한 날 즐겨 드시던 요리는 무엇인가요?' },
  { title: '청춘의 멜로디', q: '젊은 시절 가장 즐겨 불렀던 애창곡이나 좋아하시던 가수는 누구인가요?' },
  { title: '학창 시절의 벗', q: '학창 시절 가장 친했던 친구의 이름과 그 친구와의 잊지 못할 추억은 무엇인가요?' },
  { title: '자랑스러운 순간', q: '평생 가장 열정적으로 일하셨던 직업이나, 가장 자랑스러웠던 성취는 무엇인가요?' },
  { title: '행복했던 가족 여행', q: '가족들과 함께 갔던 여행지 중 가장 행복하게 웃었던 곳은 어디인가요?' },
  { title: '소중한 취미', q: '젊은 시절 시간 가는 줄 모르고 즐기셨던 취미나 여가 활동은 무엇인가요?' },
  { title: '감사한 인연', q: '인생을 살면서 가장 고마웠던 사람이나 은인은 누구인가요?' },
  { title: '새 생명의 기쁨', q: '자녀나 손주를 처음 품에 안았을 때의 기분이나 기억나는 에피소드가 있나요?' },
  { title: '나만의 보물', q: '지금까지 가장 아끼시는 물건(보물 1호)과 그에 얽힌 특별한 사연은 무엇인가요?' },
];

export default function MemoryInput() {
  const router = useRouter();

  const [answers, setAnswers] = useState<string[]>(() => Array(MEMORY_QUESTIONS.length).fill(''));
  const [photos, setPhotos] = useState<number[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['손자', '민우']);

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const barWidth = useRef(new Animated.Value(0)).current;

  const updateAnswer = (i: number, t: string) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = t;
      return next;
    });

  const addPhoto = () => setPhotos((p) => [...p, p.length]);
  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };
  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  useEffect(() => {
    if (!processing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 4);
        Animated.timing(barWidth, { toValue: next, duration: 120, easing: Easing.out(Easing.ease), useNativeDriver: false }).start();
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => router.replace('/caregiver/home'), 500);
        }
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [processing, barWidth, router]);

  const startEmbedding = () => {
    setProgress(0);
    barWidth.setValue(0);
    setProcessing(true);
  };

  const widthInterpolate = barWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackButton bg={Caregiver.surfaceAlt} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>환자 정보 및 추억 입력</Text>
          <Text style={styles.subtitle}>김순자 할머니의 소중한 추억을 등록하면 AI가 회상 대화에 활용해요.</Text>

          <View style={styles.notice}>
            <Feather name="heart" size={20} color={Caregiver.primaryDeep} />
            <Text style={styles.noticeText}>기억나시는 부분만 편하게 적어주세요. (모두 선택 입력이에요)</Text>
          </View>

          {MEMORY_QUESTIONS.map((item, i) => (
            <View key={item.title} style={styles.qCard}>
              <View style={styles.qHead}>
                <View style={styles.qNum}>
                  <Text style={styles.qNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.qTitle}>{item.title}</Text>
              </View>
              <TextInput
                style={styles.qInput}
                value={answers[i]}
                onChangeText={(t) => updateAnswer(i, t)}
                placeholder={item.q}
                placeholderTextColor={Caregiver.textSub}
                multiline
                textAlignVertical="top"
              />
            </View>
          ))}

          <Text style={styles.sectionLabel}>사진 업로드</Text>
          <View style={styles.photoRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="사진 추가" onPress={addPhoto} style={styles.dropzone}>
              <Feather name="image" size={28} color={Caregiver.primaryDeep} />
              <Text style={styles.dropText}>사진 추가</Text>
            </Pressable>
            {photos.map((p) => (
              <View key={p} style={[styles.thumb, { backgroundColor: PHOTO_TINTS[p % PHOTO_TINTS.length] }]}>
                <Feather name="image" size={26} color="#FFFFFF" />
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>관계 인물</Text>
          <View style={styles.tagInputRow}>
            <TextInput style={styles.tagInput} value={tagInput} onChangeText={setTagInput} placeholder="이름을 입력하고 추가 (예: 민우)" placeholderTextColor={Caregiver.textSub} onSubmitEditing={addTag} returnKeyType="done" />
            <Pressable accessibilityRole="button" accessibilityLabel="태그 추가" onPress={addTag} style={styles.tagAdd}>
              <Feather name="plus" size={24} color={Caregiver.onPrimary} />
            </Pressable>
          </View>
          <View style={styles.tagWrap}>
            {tags.map((t) => (
              <Pressable key={t} accessibilityRole="button" accessibilityLabel={`${t} 삭제`} onPress={() => removeTag(t)} style={styles.tag}>
                <Text style={styles.tagText}>#{t}</Text>
                <Feather name="x" size={16} color={Caregiver.primaryDeep} />
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable accessibilityRole="button" accessibilityLabel="기억 데이터 생성" onPress={startEmbedding} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}>
            <Feather name="zap" size={22} color={Caregiver.onPrimary} />
            <Text style={styles.ctaText}>기억 데이터 생성</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {processing && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <View style={styles.overlayIcon}>
              <Feather name="database" size={38} color={Caregiver.onPrimary} />
            </View>
            <Text style={styles.overlayTitle}>AI가 추억 조각을{'\n'}기억 저장소에 보관하고 있어요</Text>
            <Text style={styles.overlayPct}>{progress}%</Text>
            <View style={styles.overlayTrack}>
              <Animated.View style={[styles.overlayBar, { width: widthInterpolate }]} />
            </View>
            <Text style={styles.overlaySub}>임베딩 → Vector DB 적재 중…</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Caregiver.bg },
  flex: { flex: 1 },

  content: { paddingHorizontal: 22, paddingTop: 88, paddingBottom: 24 },
  title: { fontSize: 27, fontWeight: '800', color: Caregiver.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, fontWeight: '500', color: Caregiver.textSub, marginTop: 8, lineHeight: 23 },

  notice: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: Caregiver.primarySoft },
  noticeText: { flex: 1, fontSize: 15, fontWeight: '700', color: Caregiver.primaryDeep, lineHeight: 21 },

  qCard: { marginTop: 14, padding: 16, borderRadius: 16, backgroundColor: Caregiver.surface, borderWidth: 1, borderColor: Caregiver.borderSoft },
  qHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  qNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: Caregiver.primarySoft, alignItems: 'center', justifyContent: 'center' },
  qNumText: { fontSize: 14, fontWeight: '800', color: Caregiver.primaryDeep },
  qTitle: { flex: 1, fontSize: 17, fontWeight: '800', color: Caregiver.text },
  qInput: { minHeight: 76, padding: 14, borderRadius: 12, backgroundColor: Caregiver.surfaceAlt, borderWidth: 1.5, borderColor: Caregiver.border, fontSize: 16, fontWeight: '500', color: Caregiver.text, lineHeight: 23 },

  sectionLabel: { fontSize: 16, fontWeight: '800', color: Caregiver.text, marginTop: 26, marginBottom: 12 },

  photoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  dropzone: { width: 96, height: 96, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: Caregiver.primary, backgroundColor: Caregiver.surface, alignItems: 'center', justifyContent: 'center', gap: 4 },
  dropText: { fontSize: 13, fontWeight: '700', color: Caregiver.primaryDeep },
  thumb: { width: 96, height: 96, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  tagInputRow: { flexDirection: 'row', gap: 10 },
  tagInput: { flex: 1, minHeight: 56, paddingHorizontal: 16, borderRadius: 14, backgroundColor: Caregiver.surface, borderWidth: 1.5, borderColor: Caregiver.border, fontSize: 17, fontWeight: '600', color: Caregiver.text },
  tagAdd: { width: 56, height: 56, borderRadius: 14, backgroundColor: Caregiver.primary, alignItems: 'center', justifyContent: 'center' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Caregiver.primarySoft },
  tagText: { fontSize: 16, fontWeight: '800', color: Caregiver.primaryDeep },

  footer: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16 },
  cta: { flexDirection: 'row', gap: 10, minHeight: 60, borderRadius: 18, backgroundColor: Caregiver.primaryDeep, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 20, fontWeight: '800', color: Caregiver.onPrimary },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(28,40,51,0.72)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  overlayCard: { width: '100%', borderRadius: 24, padding: 28, backgroundColor: Caregiver.surface, alignItems: 'center' },
  overlayIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: Caregiver.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  overlayTitle: { fontSize: 19, fontWeight: '800', color: Caregiver.text, textAlign: 'center', lineHeight: 28 },
  overlayPct: { fontSize: 40, fontWeight: '800', color: Caregiver.primaryDeep, marginTop: 18 },
  overlayTrack: { width: '100%', height: 12, borderRadius: 6, backgroundColor: Caregiver.surfaceDeep, overflow: 'hidden', marginTop: 12 },
  overlayBar: { height: '100%', borderRadius: 6, backgroundColor: Caregiver.primary },
  overlaySub: { fontSize: 14, fontWeight: '600', color: Caregiver.textSub, marginTop: 14 },
});
