import React from 'react'
import { SafeAreaView, View, StatusBar, Button, StyleSheet } from 'react-native'

import SwipeButton from './src/components/SwipeButton/index'

const App = () => {
  let forceResetLastButton = null

  return (
    <>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView>
        <View style={styles.container}>
          <SwipeButton
            thumbIconBackgroundColor='#FFFFFF'
            title='Slide to unlock'
            railStyles={styles.rail}
            forceReset={(reset) => {
              forceResetLastButton = reset
            }}
            onSwipeSuccess={() => console.log('call')}
          />
          <View style={styles.content}>
            <Button
              onPress={() => forceResetLastButton && forceResetLastButton()}
              title='Force reset'
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: { padding: 15, paddingTop: 20 },
  swipeStatus: {
    color: '#FF0000',
    fontSize: 15,
    paddingVertical: 3,
    marginVertical: 5,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 1,
    textAlign: 'center'
  },
  subHeading: { color: '#140866', fontSize: 15 },
  title: {
    color: '#700D99',
    fontSize: 20
  },
  rail: {
    backgroundColor: '#44000088',
    borderColor: '#880000FF'
  },
  content: {
    alignItems: 'center',
    marginBottom: 5
  }
})

export default App
