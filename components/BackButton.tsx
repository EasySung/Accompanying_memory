/**
 * BackButton — 모든 화면 좌측 상단 공용 뒤로가기 버튼('<' 모양).
 *  - 위치: SafeAreaView 내부 좌측 상단(absolute top:28 left:16). 노치/상태바와 겹치지 않게 여백 확보.
 *  - 크기/터치: 아이콘 34 + 컨테이너 56×56 + hitSlop.
 *  - 아이콘: Feather chevron-left(얇은 라인). 색상 고대비 차콜(#1A1C20).
 *  - 동작: router.back(); 스택이 없으면 역할 선택('/')으로 안전 앵커링.
 */

import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

const ICON_COLOR = '#1A1C20';

type Props = {
  bg?: string;
  style?: ViewStyle;
};

export function goBackSafe() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

export default function BackButton({ bg = 'transparent', style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="뒤로 가기"
      hitSlop={8}
      onPress={goBackSafe}
      style={({ pressed }) => [styles.btn, { backgroundColor: bg }, pressed && styles.pressed, style]}
    >
      <Feather name="chevron-left" size={34} color={ICON_COLOR} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    top: 28,
    left: 16,
    zIndex: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.6 },
});
