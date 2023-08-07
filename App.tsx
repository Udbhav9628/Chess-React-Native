import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import Board from './src/Components/Board';
import { Chess } from "chess.js";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Peer from "simple-peer";
import io from "socket.io-client";
const socket = io("https://13.233.65.153");

const App = () => {

  const chessInstance: any = new Chess();

  const [chessState, setchessState] = useState({
    player: 'w',
    board: chessInstance.board(),
    chessInstance: chessInstance
  })


  useEffect(() => {
    console.log(chessState.chessInstance.ascii())
    console.log(chessState.chessInstance.turn())
    // console.log(chessState.chessInstance.fen())
  }, [chessState])


  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <StatusBar
          animated={true}
          backgroundColor="black"
        />
        <Board chessState={chessState} setchessState={setchessState} />
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