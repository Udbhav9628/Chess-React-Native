import { StyleSheet, View } from 'react-native';
import React, { useCallback } from 'react';
import Row from './Row';
import Pieces from '../Utils/Pieces';
// import Logo from '../Assets/Pieces/rook4-w.svg';

interface Props {
    chessState: any;
    setchessState: Function
}

const Board = ({ chessState, setchessState }: Props) => {
    const onTurn = useCallback(() => {
        setchessState({
            player: chessState?.player === "w" ? "b" : "w",
            board: chessState?.board,
            chessInstance: chessState?.chessInstance
        });
    }, [chessState?.player, chessState?.board, chessState?.chessInstance]);

    return (
        <View style={styles.container}>
            {
                new Array(8).fill(0).map((_, index) => (<Row key={index} row={index} />))
            }
            {chessState?.board?.map((row: Array<any>, yIndex: number) => row?.map((square, xIndex) => {
                // //console.log('************8');
                // //console.log(yIndex, '  ', xIndex);
                // //console.log(square);
                if (square !== null) {
                    return (
                        <Pieces enableMove={chessState?.player === square.color} onTurn={onTurn} chess={chessState} position={{ x: (xIndex * 45), y: (yIndex * 40) }} key={xIndex} id={`${square.color}${square.type}` as "br" | "bp" | "bn" | "bb" | "bq" | "bk" | "wr" | "wn" | "wb" | "wq" | "wk" | "wp"} />
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
});
