import React from 'react'
import { SafeAreaView, View, StyleSheet } from 'react-native'

import SwipeButton from './src/components/SwipeButton/index'

const App = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <SwipeButton
          title={'Slide to unlock'}
          titleStyle={styles.title}
          railStyles={styles.rail}
          onSwipeSuccess={() => console.log('call')}
          shouldResetAfterSuccess
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 50
  },
  title: {
    color: '#700D99',
    fontSize: 20
  },
  rail: {
    backgroundColor: '#44000088',
    borderColor: '#880000FF',
    borderWidth: 1
  }
})

export default App
