import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Entry from "./src/Components/index";
// import Logo from '../Assets/Pieces/rook4-w.svg';

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <StatusBar
          animated={true}
          backgroundColor='#00041f'
        />
        <Entry />
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#00041f',
    alignContent: 'center',
    justifyContent: 'center'
  }
})