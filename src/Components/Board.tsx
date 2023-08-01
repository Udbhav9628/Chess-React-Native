import { StyleSheet, View } from 'react-native';
import React from 'react';
import Row from './Row';
import Pieces from '../Utils/Pieces';
// import Logo from '../Assets/Pieces/rook4-w.svg';

const Board = ({ chessState }: any) => {
    return (
        <View style={styles.container}>
            {
                new Array(8).fill(0).map((_, index) => (<Row key={index} row={index} />))
            }
            {chessState?.board?.map((row: Array<any>, yIndex: number) => row?.map((square, xIndex) => {
                if (square !== null) {
                    return (
                        <Pieces position={{ x: (xIndex * 45), y: (yIndex * 40) }} key={xIndex} id={`${square.color}${square.type}` as "br" | "bp" | "bn" | "bb" | "bq" | "bk" | "wr" | "wn" | "wb" | "wq" | "wk" | "wp"} />
                    )
                }
            }))}
        </View>
    )
}

export default Board;

const styles = StyleSheet.create({
    container: {
        borderWidth: 5,
        borderColor: '#023020',
        margin: 10
    }
})