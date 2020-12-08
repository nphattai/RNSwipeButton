import React, { useState, useEffect, useRef } from 'react'
import {
  Animated,
  PanResponder,
  StyleProp,
  TouchableNativeFeedback,
  View,
  ViewStyle,
  GestureResponderEvent,
  PanResponderGestureState
} from 'react-native'

// Styles
import styles from './styles'

const defaultContainerWidth = 50

export interface SwipeThumbProps {
  layoutWidth: number
  forceReset?: (callback?: () => void) => void
  disabled?: boolean
  onSwipeStart?: () => void
  onSwipeSuccess?: () => void
  onSwipeFail?: () => void
  railStyles: StyleProp<ViewStyle>
  screenReaderEnabled?: boolean
  resetAfterSuccessAnimDelay?: number
  shouldResetAfterSuccess?: boolean
  swipeSuccessThreshold?: number
}

const SwipeThumb = (props: Partial<SwipeThumbProps>) => {
  const {
    layoutWidth = 0,
    forceReset,
    disabled = false,
    onSwipeStart,
    onSwipeSuccess,
    onSwipeFail,
    railStyles,
    screenReaderEnabled,
    resetAfterSuccessAnimDelay = 1000,
    shouldResetAfterSuccess = false,
    swipeSuccessThreshold = 90
  } = props
  const animatedWidth = useRef(new Animated.Value(defaultContainerWidth))
    .current

  const [defaultWidth, setDefaultWidth] = useState(defaultContainerWidth)

  const panStyle = Object.assign(
    {},
    { width: animatedWidth },
    styles.container,
    railStyles
  )

  const onPanResponderStart = () => {
    if (disabled) {
      return
    }
    onSwipeStart && onSwipeStart()
  }

  async function onPanResponderMove(
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) {
    if (disabled) {
      return
    }
    const newWidth = defaultContainerWidth + gestureState.dx
    if (newWidth < defaultContainerWidth) {
      // Reached starting position
      reset()
    } else if (newWidth > layoutWidth) {
      // Reached end position
      setDefaultWidth(layoutWidth)
    } else {
      await Animated.timing(animatedWidth, {
        toValue: newWidth,
        duration: 0,
        useNativeDriver: false
      }).start()
      setDefaultWidth(newWidth)
    }
  }

  function onPanResponderRelease(
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) {
    if (disabled) {
      return
    }
    const newWidth = defaultContainerWidth + gestureState.dx
    const successThresholdWidth = layoutWidth * (swipeSuccessThreshold / 100)
    newWidth < successThresholdWidth
      ? onSwipeNotMetSuccessThreshold()
      : onSwipeMetSuccessThreshold(newWidth)
  }

  const onSwipeNotMetSuccessThreshold = () => {
    // Animate to initial position
    setDefaultWidth(defaultContainerWidth)
    onSwipeFail && onSwipeFail()
  }

  const onSwipeMetSuccessThreshold = (newWidth: number) => {
    if (newWidth !== layoutWidth) {
      finishRemainingSwipe()
      return
    }
    onSwipeSuccess && onSwipeSuccess()
    reset()
  }

  const finishRemainingSwipe = () => {
    // Animate to final position
    setDefaultWidth(layoutWidth)
    onSwipeSuccess && onSwipeSuccess()

    //Animate back to initial position after successfully swiped
    const timeout = setTimeout(() => {
      shouldResetAfterSuccess && reset()
      clearTimeout(timeout)
    }, resetAfterSuccessAnimDelay)
  }

  const reset = () => {
    setDefaultWidth(defaultContainerWidth)
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onShouldBlockNativeResponder: () => true,
      onPanResponderStart,
      onPanResponderMove,
      onPanResponderRelease
    })
  ).current

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: defaultWidth,
      duration: 400,
      useNativeDriver: false
    }).start()
  }, [animatedWidth, defaultWidth])

  useEffect(() => {
    forceReset && forceReset(reset)
  }, [forceReset])

  const renderThumbIcon = () => {
    return <View style={styles.icon} />
  }

  return (
    <>
      {screenReaderEnabled ? (
        <TouchableNativeFeedback
          disabled={disabled}
          onPress={onSwipeSuccess}
          accessible
        >
          <View style={[panStyle, { width: defaultContainerWidth }]}>
            {renderThumbIcon()}
          </View>
        </TouchableNativeFeedback>
      ) : (
        <Animated.View style={panStyle} {...panResponder.panHandlers}>
          {renderThumbIcon()}
        </Animated.View>
      )}
    </>
  )
}

export default SwipeThumb
