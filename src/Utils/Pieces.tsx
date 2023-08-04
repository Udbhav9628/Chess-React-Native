import { Image, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { toTranslation, toPosition } from "../Utils/Notation";

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

const Pieces = ({ id, position, chess, onTurn, enableMove }: PiecesProps) => {

    const isGestureActive = useSharedValue(false);
    const offsetX = useSharedValue(0)//// Where Chess Piece is
    const offsetY = useSharedValue(0)
    const translateX = useSharedValue(position?.x)
    const translateY = useSharedValue(position?.y)

    const piece = useAnimatedStyle(() => ({
        position: 'absolute',
        transform: [
            { translateX: translateX?.value },
            { translateY: translateY.value }
        ]
    }))

    const movePiece = useCallback(
        (to: string) => {
            const moves = chess.chessInstance.moves({ verbose: true });
            const from = toPosition({ x: offsetX.value, y: offsetY.value });
            const move = moves.find((m: any) => m.from === from && m.to === to);
            const { x, y } = toTranslation(move ? move.to : from);
            translateX.value = withTiming(x, { duration: 200 }, () => {
                //// since move has been make updating offsetX.value
                offsetX.value = translateX.value;
            });
            translateY.value = withTiming(y, { duration: 200 }, () => {
                offsetY.value = translateY.value;
                isGestureActive.value = false;
            });
            if (move) {
                chess.chessInstance.move({ from, to });
                onTurn();
            }
        },
        [chess, isGestureActive, offsetX, offsetY, translateX, translateY]
    );

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: () => {
            // //Store the initial translation values for later use
            offsetX.value = translateX?.value;
            offsetY.value = translateY?.value;
        },
        onActive: ({ translationX, translationY }) => {
            // // Update the translation values based on the gesture event
            translateX.value = translationX + offsetX?.value;
            translateY.value = translationY + offsetY?.value;
        },
        onEnd: () => {
            runOnJS(movePiece)(
                toPosition({ x: translateX.value, y: translateY.value }) // // returns a3 , e4 etc
            );
        },
    })

    return (
        <PanGestureHandler onGestureEvent={onGestureEvent} enabled={enableMove}>
            <Animated.View style={piece}>
                <Image style={styles.Pieces} source={PIECES[id]} />
            </Animated.View>
        </PanGestureHandler>
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
}