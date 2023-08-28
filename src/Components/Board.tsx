import { StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import Row from './Row';
import Pieces from '../Utils/Pieces';
import { context } from '../Utils/Context';

interface Props {
    chessState: any;
    setchessState: Function
}

const Board = ({ chessState, setchessState }: Props) => {
    const contextApi = context();

    const onTurn = useCallback(() => {
        setchessState({
            player: chessState?.chessInstance?.turn(),
            board: chessState?.chessInstance?.board(),
            chessInstance: chessState?.chessInstance
        });
    }, [chessState?.player, chessState?.board, chessState?.chessInstance]);

    useEffect(() => {
        // onNewMove(contextApi?.newMove?.From, contextApi?.newMove?.To)
        console.log("In Pieces");
        console.log(contextApi?.newMove);
    }, [contextApi?.newMove])

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
        borderWidth: 10,
        borderColor: '#023020',
        borderRadius: 10
    }
});
