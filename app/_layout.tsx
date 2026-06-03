/**
 * RootLayout — expo-router 단일 루트.
 *  - 모든 Stack 헤더는 숨김(headerShown:false): 화면별 커스텀 헤더 + SafeArea로 테마 밀착.
 *  - 화면마다 테마(환자 주황 / 보호자 하늘색)가 다르므로 네비게이션 배경은 중립으로 둔다.
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="patient/home" />
          <Stack.Screen name="caregiver/onboarding" />
          <Stack.Screen name="caregiver/memory-input" />
          <Stack.Screen name="caregiver/home" />
          <Stack.Screen name="caregiver/report" />
          <Stack.Screen name="caregiver/alerts" />
        </Stack>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
