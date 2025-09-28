import { View, Text, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const layout = () => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={-64}>
      <Stack>
        <Stack.Screen name="Loginscreen" options={{
          headerTitle: "",
          headerTransparent: true,
          headerShadowVisible: false
        }} />
      </Stack>
    </KeyboardAvoidingView>
  )
}

export default layout