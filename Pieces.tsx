import { Image, StyleSheet } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { toTranslation, toPosition } from "../Utils/Notation";
import { context } from '../Utils/Context';

const PIECES = {
    'br': require("../Assets/Icons/black-rook.png"),
    'bp': require("../Assets/Icons/black-pawn.png"),
    'bn': require("../Assets/Icons/black-knight.png"),
    'bb': require("../Assets/Icons/black-bishop.png"),
    'bq': require("../Assets/Icons/black-queen.png"),
    'bk': require("../Assets/Icons/black-king.png"),
    'wr': require("../Assets/Icons/white-rook.png"),
    'wn': require("../Assets/Icons/white-knight.png"),
    'wb': require("../Assets/Icons/white-bishop.png"),
    'wq': require("../Assets/Icons/white-queen.png"),
    'wk': require("../Assets/Icons/white-king.png"),
    'wp': require("../Assets/Icons/white-pawn.png"),
};

const Pieces = ({ id, position, chess, onTurn, enableMove, pieceId, chessMove }: PiecesProps) => {

    const contextApi = context();
    const offsetX = useSharedValue(0)//// Where Chess Piece is, initial Value
    const offsetY = useSharedValue(0)
    const translateX = useSharedValue(position?.x)
    const translateY = useSharedValue(position?.y)
    const isGestureActive = useSharedValue(false);

    const sendMove = (from: string, whereToMove: string, whichPiece: string) => {
        contextApi?.socket.emit('chessMove', { moveObj: { From: from, To: whereToMove, chessPiece: whichPiece }, towhom: contextApi?.opponentSocketId })
    }

    const onNewMove = useCallback(
        (From: string, to: string) => {
            const moves = chess.chessInstance.moves({ verbose: true });
            const move = moves.find((m: any) => m.from === From && m.to === to);
            const { x, y } = toTranslation(move ? move.to : From);
            translateX.value = withTiming(x, { duration: 300 }, () => {
                offsetX.value = translateX.value;
            });
            translateY.value = withTiming(y, { duration: 300 }, () => {
                offsetY.value = translateY.value;
            });
            if (move) {
                chess.chessInstance.move({ from: From, to: to });
                onTurn();
            }
        },
        [chess, offsetX, offsetY, translateX, translateY]
    );

    useEffect(() => {
        if (chessMove?.current === true) {
            contextApi?.socket.on('chessMove', (moveObj: any) => {
                if (moveObj?.chessPiece === pieceId) {
                    onNewMove(moveObj?.From, moveObj?.To);
                }
            })
            chessMove?.current === false;
        }
    }, [])

    const movePiece = useCallback(
        (to: string) => {
            const moves = chess.chessInstance.moves({ verbose: true });
            const from = toPosition({ x: offsetX.value, y: offsetY.value });
            const possibleMoves = chess.chessInstance.moves({ square: from })
            // console.log(possibleMoves);
            // ! To Do Replace this with possible move only for more efficiency;
            const move = moves.find((m: any) => m.from === from && m.to === to);
            const { x, y } = toTranslation(move ? move.to : from);
            translateX.value = withTiming(x, { duration: 300 }, () => {
                //// since move has been make updating offsetX.value, because this piece position has been changed
                offsetX.value = translateX.value;
            });
            translateY.value = withTiming(y, { duration: 300 }, () => {
                offsetY.value = translateY.value;
            });
            if (move) {
                const MoveResult = chess.chessInstance.move({ from, to });
                console.log(chess.chessInstance.ascii())
                //console.log(MoveResult);
                onTurn();
                sendMove(from, to, pieceId);
                // ! To DO
            }
        },
        [chess, offsetX, offsetY, translateX, translateY]
    );

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: () => {
            // //Store the initial translation values for later use
            offsetX.value = translateX?.value;
            offsetY.value = translateY?.value;
        },
        onActive: ({ translationX, translationY }) => {
            // // Update the translation values based on the gesture event
            isGestureActive.value = true;
            translateX.value = translationX + offsetX?.value;
            translateY.value = translationY + offsetY?.value;
        },
        onEnd: () => {
            isGestureActive.value = false;
            runOnJS(movePiece)(
                toPosition({ x: translateX.value, y: translateY.value }) // // returns a3 , e4 etc
            );
        },
    })

    const piece = useAnimatedStyle(() => ({
        position: 'absolute',
        zIndex: isGestureActive.value ? 100 : 10,
        transform: [
            { translateX: translateX?.value },
            { translateY: translateY.value }
        ],
    }));

    const overlaySquare = useAnimatedStyle(() => {
        const to = toTranslation(toPosition({ x: translateX.value, y: translateY.value }))
        return {
            width: 45,
            height: 40,
            backgroundColor: isGestureActive.value
                ? "rgba(255, 255, 0, 0.5)"
                : "transparent",
            position: 'absolute',
            zIndex: 0,
            opacity: isGestureActive.value ? 1 : 0,
            transform: [
                { translateX: to.x },
                { translateY: to.y }
            ],
        }
    })

    return (
        <>
            <Animated.View style={overlaySquare} />
            <PanGestureHandler onGestureEvent={onGestureEvent} enabled={enableMove}>
                <Animated.View style={piece}>
                    <Image style={styles.Pieces} source={PIECES[id]} />
                    {/* <Text>{pieceId}</Text> */}
                </Animated.View>
            </PanGestureHandler>
        </>
    )
};

export default Pieces;

const styles = StyleSheet.create({
    Pieces: {
        width: 45,
        height: 40,
    }
})

interface PiecesProps {
    id: keyof typeof PIECES;
    position: any;
    chess: any;
    onTurn: Function;
    enableMove: boolean;
    pieceId: any;
    chessMove: any;
}
