/**
 * patient/home — 보이스 회상치료 원스크린 (대기 화면 없음)
 *  - 진입 즉시 SPEAKING 직행.
 *  - 6단계 상세 대화: 환자 답변 후 'AI 생각 중'(2.5초) 로딩 연출 → 다음 질문/사진 등장.
 *  - 인물 퀴즈 턴에서 고해상도 가상 인물 사진 노출.
 *  - 완료 시 COMPLETED → 카운트다운(4→0초) 후 역할 선택('/')으로 자동 복귀.
 */

import BackButton from '@/components/BackButton';
import { Patient } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CALL_NAME = '김순자 할머니';
const PERSON_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop';

type Mode = 'SPEAKING' | 'COMPLETED';
type Photo = { uri: string; label: string };
type Msg = { role: 'ai' | 'user'; text: string; photo?: Photo };

const AI_TURNS: { text: string; photo?: Photo }[] = [
  { text: `${CALL_NAME}, 어린 시절 살던 고향은 어떤 모습이었어요?` },
  { text: '특별한 날 즐겨 드시던 음식은 무엇이었나요?' },
  { text: '젊은 시절 즐겨 부르시던 노래가 있으세요?' },
  { text: '가족과 함께 갔던 여행 중 기억에 남는 곳이 있나요?' },
  { text: '할머니, 이분 누구인지 아세요?', photo: { uri: PERSON_PHOTO, label: '손자 · 민우' } },
  { text: '오늘 옛이야기 들려주셔서 정말 고마워요, 할머니.' },
];

const USER_REPLIES = [
  '우리 동네는 뒷산에 진달래가 흐드러지게 피고, 앞엔 맑은 개울이 흘렀지. 빨래하러 가면 송사리가 발을 간질였어.',
  '명절이면 내가 가마솥에 갈치조림을 했는데, 무를 큼직하게 썰어 넣고 양념이 푹 배도록 졸이면 온 식구가 밥 두 그릇씩 비웠어.',
  '이미자의 동백 아가씨를 참 좋아했지. 라디오에서 그 노래가 나오면 호미를 든 채로 흥얼거리곤 했단다.',
  '그럼 기억나지, 우리 손자 민우랑 제주도 바닷가 앞에서 갈치조림 먹을 때 정말 볕이 좋았어.',
  '아이고, 우리 민우구나! 볼이 통통한 게 어릴 적 그대로네. 내가 어찌 우리 강아지를 잊겠니.',
  '이렇게 옛날 얘기를 하니까 마음이 참 따뜻하구나. 고맙다, 또 놀러 오너라.',
];

export default function PatientHome() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('SPEAKING');
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: AI_TURNS[0].text }]);
  const [step, setStep] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(4);

  const scrollRef = useRef<ScrollView>(null);
  const blink = useRef(new Animated.Value(0)).current;
  const thinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (thinkTimer.current) clearTimeout(thinkTimer.current);
    if (finishTimer.current) clearTimeout(finishTimer.current);
  }, []);

  useEffect(() => {
    let anim: Animated.CompositeAnimation | undefined;
    if (mode === 'SPEAKING') {
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(blink, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(blink, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
      anim.start();
    } else {
      blink.stopAnimation();
      blink.setValue(0);
    }
    return () => anim?.stop();
  }, [mode, blink]);

  useEffect(() => {
    if (mode !== 'COMPLETED') return;
    setSecondsLeft(4);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          router.replace('/');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [mode, router]);

  const handleMic = () => {
    if (thinking || finishing) return;
    if (step < AI_TURNS.length - 1) {
      setMessages((prev) => [...prev, { role: 'user', text: USER_REPLIES[step] }]);
      // AI 생각 중 연출 (약 2.5초) → 다음 질문/사진 등장
      setThinking(true);
      thinkTimer.current = setTimeout(() => {
        const nextAi = AI_TURNS[step + 1];
        setMessages((prev) => [...prev, { role: 'ai', text: nextAi.text, photo: nextAi.photo }]);
        setThinking(false);
        setStep((v) => v + 1);
      }, 2500);
    } else {
      setMessages((prev) => [...prev, { role: 'user', text: USER_REPLIES[step] }]);
      setFinishing(true);
      finishTimer.current = setTimeout(() => setMode('COMPLETED'), 1400);
    }
  };

  const blinkScale = blink.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const ringOpacity = blink.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });
  const ringScale = blink.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const thinkOpacity = blink.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const micDisabled = thinking || finishing;

  // ───────────────────────── COMPLETED ─────────────────────────
  if (mode === 'COMPLETED') {
    return (
      <SafeAreaView style={[styles.safe, styles.completedSafe]} edges={['top', 'bottom']}>
        <BackButton bg={Patient.surfaceAlt} />
        <View style={styles.completedWrap}>
          <View style={styles.completedMark}>
            <Feather name="check" size={56} color={Patient.primaryDeep} />
          </View>
          <Text style={styles.completedTitle}>{CALL_NAME},{'\n'}오늘 대화도 참 잘하셨어요!</Text>
          <Text style={styles.completedMsg}>내일 또 만나요.</Text>
          <View style={styles.completedNote}>
            <Feather name="clock" size={18} color={Patient.primaryDeep} />
            <Text style={styles.completedNoteText}>정리 중... (남은 시간: {secondsLeft}초)</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ────────────────────────── SPEAKING ──────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <BackButton bg={Patient.surfaceAlt} />

      <View style={styles.topBar}>
        <View style={styles.callChip}>
          <View style={styles.callDot} />
          <Text style={styles.callChipText}>통화 중 · 기억이</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.thread}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m, i) =>
          m.role === 'ai' ? (
            <View key={i} style={styles.aiRow}>
              <View style={styles.aiAvatar}>
                <Feather name="message-circle" size={20} color={Patient.onPrimary} />
              </View>
              <View style={styles.aiCol}>
                {m.photo && (
                  <View style={styles.photoCard}>
                    <Image source={{ uri: m.photo.uri }} style={styles.photo} resizeMode="cover" />
                    <View style={styles.photoTag}>
                      <Text style={styles.photoTagText}>{m.photo.label}</Text>
                    </View>
                  </View>
                )}
                <View style={styles.aiBubble}>
                  <Text style={styles.aiBubbleText}>{m.text}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View key={i} style={styles.userRow}>
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{m.text}</Text>
              </View>
            </View>
          )
        )}

        {/* AI 생각 중 인디케이터 */}
        {thinking && (
          <View style={styles.aiRow}>
            <View style={styles.aiAvatar}>
              <Feather name="message-circle" size={20} color={Patient.onPrimary} />
            </View>
            <Animated.View style={[styles.thinkBubble, { opacity: thinkOpacity }]}>
              <Feather name="more-horizontal" size={30} color={Patient.primaryDeep} />
              <Text style={styles.thinkText}>기억이가 생각하고 있어요...</Text>
            </Animated.View>
          </View>
        )}
      </ScrollView>

      <View style={styles.micArea}>
        <Text style={styles.micHint}>
          {thinking ? '기억이가 생각하고 있어요...' : '버튼을 누르고 말씀해 보세요'}
        </Text>
        <View style={styles.micWrap}>
          <Animated.View style={[styles.micRing, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]} />
          <Animated.View style={{ transform: [{ scale: micDisabled ? 1 : blinkScale }] }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="말하기"
              disabled={micDisabled}
              onPress={handleMic}
              style={({ pressed }) => [styles.mic, (pressed || micDisabled) && { opacity: 0.85 }]}
            >
              <Feather name="mic" size={52} color={Patient.onPrimary} />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Patient.bg, paddingHorizontal: 18 },
  flex: { flex: 1 },

  topBar: { minHeight: 64, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  callChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 40, borderRadius: 20, backgroundColor: Patient.primarySoft },
  callDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Patient.primaryDeep },
  callChipText: { fontSize: 16, fontWeight: '800', color: Patient.primaryDeep },

  thread: { paddingVertical: 14, gap: 16 },

  aiRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  aiAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Patient.primary, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  aiCol: { flex: 1, gap: 12 },
  aiBubble: { alignSelf: 'flex-start', maxWidth: '100%', backgroundColor: Patient.primarySoft, borderRadius: 26, borderTopLeftRadius: 8, paddingVertical: 20, paddingHorizontal: 22 },
  aiBubbleText: { flexShrink: 1, fontSize: 30, fontWeight: '800', color: Patient.text, lineHeight: 44, letterSpacing: -0.4 },

  thinkBubble: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start', backgroundColor: Patient.primarySoft, borderRadius: 26, borderTopLeftRadius: 8, paddingVertical: 16, paddingHorizontal: 20 },
  thinkText: { fontSize: 18, fontWeight: '700', color: Patient.primaryDeep },

  userRow: { alignItems: 'flex-end' },
  userBubble: { maxWidth: '86%', backgroundColor: Patient.primary, borderRadius: 26, borderTopRightRadius: 8, paddingVertical: 16, paddingHorizontal: 20 },
  userBubbleText: { flexShrink: 1, fontSize: 20, fontWeight: '700', color: Patient.onPrimary, lineHeight: 30 },

  photoCard: {
    width: '82%',
    alignSelf: 'flex-start',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Patient.surfaceAlt,
    shadowColor: Patient.primaryDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  photo: { width: '100%', height: 240 },
  photoTag: { position: 'absolute', bottom: 12, left: 12, paddingHorizontal: 16, height: 40, borderRadius: 20, backgroundColor: 'rgba(44,37,32,0.82)', alignItems: 'center', justifyContent: 'center' },
  photoTagText: { fontSize: 17, fontWeight: '800', color: Patient.white },

  micArea: { alignItems: 'center', paddingBottom: 18, gap: 14 },
  micHint: { fontSize: 18, fontWeight: '600', color: Patient.textSub },
  micWrap: { width: 180, height: 140, alignItems: 'center', justifyContent: 'center' },
  micRing: { position: 'absolute', width: 118, height: 118, borderRadius: 59, backgroundColor: Patient.primary },
  mic: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: Patient.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Patient.primaryDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },

  completedSafe: { backgroundColor: Patient.bg, justifyContent: 'center' },
  completedWrap: { alignItems: 'center', paddingHorizontal: 10, gap: 18 },
  completedMark: { width: 120, height: 120, borderRadius: 60, backgroundColor: Patient.primarySoft, alignItems: 'center', justifyContent: 'center' },
  completedTitle: { fontSize: 36, fontWeight: '800', color: Patient.text, textAlign: 'center', lineHeight: 48, letterSpacing: -0.5 },
  completedMsg: { fontSize: 22, fontWeight: '700', color: Patient.primaryDeep, textAlign: 'center' },
  completedNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, paddingHorizontal: 16, height: 44, borderRadius: 22, backgroundColor: Patient.surfaceAlt },
  completedNoteText: { fontSize: 15, fontWeight: '700', color: Patient.textSub },
});
