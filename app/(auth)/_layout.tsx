import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const layout = () => {
  return (
    <Stack>
      <Stack.Screen name="Loginscreen" options={{
        headerTitle: "",
        headerTransparent: true,
        headerShadowVisible: false
      }} />
    </Stack>
  )
}

export default layout