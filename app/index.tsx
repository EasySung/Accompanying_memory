/**
 * index — 역할 선택 진입 화면.
 *  - 환자(이용자) → /patient/home (보이스 회상치료 원스크린)
 *  - 보호자       → /caregiver/onboarding (초기 설정 → 기억 입력 → 대시보드)
 *  - 아이콘은 Feather 라인 아이콘으로 통일.
 */

import { Caregiver, Patient } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RoleCardProps = {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  desc: string;
  bg: string;
  tile: string;
  fg: string;
  sub: string;
  onPress: () => void;
};

function RoleCard({ icon, title, desc, bg, tile, fg, sub, onPress }: RoleCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: bg, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <View style={[styles.tile, { backgroundColor: tile }]}>
        <Feather name={icon} size={38} color="#FFFFFF" />
      </View>
      <Text style={[styles.cardTitle, { color: fg }]}>{title}</Text>
      <Text style={[styles.cardDesc, { color: sub }]}>{desc}</Text>
      <View style={[styles.go, { backgroundColor: tile }]}>
        <Feather name="arrow-right" size={24} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

export default function RoleSelect() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <Feather name="heart" size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.logoText}>기억동행</Text>
      </View>

      <Text style={styles.headline}>어떤 분이신가요?</Text>
      <Text style={styles.lead}>역할에 맞는 화면으로 편안하게 안내해 드릴게요.</Text>

      <View style={styles.cards}>
        <RoleCard
          icon="smile"
          title="이용자로 시작"
          desc={'목소리로 추억을\n함께 떠올려요'}
          bg={Patient.primarySoft}
          tile={Patient.primaryDeep}
          fg={Patient.text}
          sub={Patient.textSub}
          onPress={() => router.replace('/patient/home')}
        />
        <RoleCard
          icon="shield"
          title="보호자로 시작"
          desc={'기억을 채우고\n변화를 살펴요'}
          bg={Caregiver.primarySoft}
          tile={Caregiver.primaryDeep}
          fg={Caregiver.text}
          sub={Caregiver.textSub}
          onPress={() => router.replace('/caregiver/onboarding')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24 },
  logoMark: { width: 40, height: 40, borderRadius: 12, backgroundColor: Patient.primaryDeep, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: '800', color: '#2C2520' },
  headline: { fontSize: 32, fontWeight: '800', color: '#2C2520', marginTop: 40, letterSpacing: -0.5 },
  lead: { fontSize: 18, fontWeight: '500', color: '#7A6E64', marginTop: 12, lineHeight: 26 },
  cards: { flex: 1, justifyContent: 'center', gap: 18, paddingBottom: 24 },
  card: { borderRadius: 28, padding: 28, minHeight: 190, justifyContent: 'flex-start' },
  tile: { width: 76, height: 76, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 26, fontWeight: '800', marginTop: 18, letterSpacing: -0.3 },
  cardDesc: { fontSize: 18, fontWeight: '600', marginTop: 6, lineHeight: 26 },
  go: { position: 'absolute', right: 24, bottom: 24, width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
});
