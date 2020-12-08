import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  AccessibilityInfo,
  StyleProp,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent
} from 'react-native'

// Components
import SwipeThumb, { SwipeThumbProps } from '../SwipeThumb'

// Styles
import styles from './styles'

export interface SwipeButtonProps extends Partial<SwipeThumbProps> {
  containerStyles?: StyleProp<ViewStyle>
  title?: string
  titleStyle?: StyleProp<TextStyle>
}

const SwipeButton = (props: SwipeButtonProps) => {
  const { containerStyles, title, titleStyle, ...swipeThumbProps } = props

  const [layoutWidth, setLayoutWidth] = useState<number>(0)
  const [screenReaderEnabled, setScreenReaderEnabled] = useState<boolean>(false)
  const [isUnMounting, setIsUnMounting] = useState<boolean>(false)

  const onLayoutContainer = async (event: LayoutChangeEvent) => {
    if (isUnMounting || layoutWidth) {
      return
    }
    setLayoutWidth(event.nativeEvent.layout.width)
  }

  useEffect(() => {
    const handleScreenReaderToggled = (isEnabled: boolean) => {
      if (isUnMounting || screenReaderEnabled === isEnabled) {
        return
      }
      setScreenReaderEnabled(isEnabled)
    }
    setIsUnMounting(false)
    AccessibilityInfo.addEventListener('change', handleScreenReaderToggled)

    AccessibilityInfo.isScreenReaderEnabled().then((isEnabled) => {
      if (isUnMounting) {
        return
      }
      setScreenReaderEnabled(isEnabled)
    })

    return () => {
      setIsUnMounting(true)
      AccessibilityInfo.removeEventListener('change', handleScreenReaderToggled)
    }
  }, [isUnMounting, screenReaderEnabled])

  return (
    <View
      style={[styles.container, containerStyles]}
      onLayout={onLayoutContainer}
    >
      <Text
        importantForAccessibility={
          screenReaderEnabled ? 'no-hide-descendants' : 'auto'
        }
        style={[styles.title, titleStyle]}
      >
        {title}
      </Text>
      {layoutWidth > 0 && (
        <SwipeThumb
          layoutWidth={layoutWidth}
          screenReaderEnabled={screenReaderEnabled}
          {...swipeThumbProps}
        />
      )}
    </View>
  )
}

export default SwipeButton
