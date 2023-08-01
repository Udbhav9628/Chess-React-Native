import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Board from './src/Components/Board';
import { Chess } from "chess.js";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {

  const chessInstance: any = new Chess();
  const [chessState, setchessState] = useState({
    player: 'w',
    board: chessInstance.board()
  })

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <StatusBar
          animated={true}
          backgroundColor="black"
        />
        <Board chessState={chessState} />
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  }
})