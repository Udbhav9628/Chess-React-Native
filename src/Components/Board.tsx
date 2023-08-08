import { StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Row from './Row';
import Pieces from '../Utils/Pieces';
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://192.168.124.232:8000");

interface Props {
    chessState: any;
    setchessState: Function
}

const Board = ({ chessState, setchessState }: Props) => {

    const [mySocketId, setmySocketId] = useState('');
    const [newMove, setnewMove] = useState({})

    const onTurn = useCallback(() => {
        setchessState({
            player: chessState?.chessInstance?.turn(),
            board: chessState?.chessInstance?.board(),
            chessInstance: chessState?.chessInstance
        });
    }, [chessState?.player, chessState?.board, chessState?.chessInstance]);

    useEffect(() => {
        socket.on("me", (id) => setmySocketId(id));
    }, [])

    useEffect(() => {
        console.log('My Socket Id ---', ' - ', mySocketId);
    }, [mySocketId])


    //// Listening New Chess Move of Opponent Player
    useEffect(() => {
        socket.on('chessMove', (moveObj) => {
            console.log('New Chess Move');
            console.log(moveObj);
            setnewMove(moveObj);
        })
    }, [])




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
