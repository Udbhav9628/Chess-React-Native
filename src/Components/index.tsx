import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chess } from "chess.js";
import Board from './Board';

const index = () => {

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
        <View style={styles.container}>
            <Board chessState={chessState} setchessState={setchessState} />
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});