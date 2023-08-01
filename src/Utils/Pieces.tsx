import { Image, StyleSheet } from 'react-native';
import React from 'react';
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

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

interface PiecesProps {
    id: keyof typeof PIECES
    position: any
}

const Pieces = ({ id, position }: PiecesProps) => {

    const offsetX = useSharedValue(0)
    const offsetY = useSharedValue(0)
    const translateX = useSharedValue(position?.x)
    const translateY = useSharedValue(position?.y)

    const piece = useAnimatedStyle(() => ({
        position: 'absolute',
        transform: [{ translateX: translateX?.value }, { translateY: translateY.value }]
    }))

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: () => {
            offsetX.value = translateX?.value;
            offsetY.value = translateY?.value
        },
        onActive: ({ translationX, translationY }) => {
            translateX.value = translationX + offsetX?.value;
            translateY.value = translationY + offsetY?.value;
        }
    })

    return (
        <PanGestureHandler onGestureEvent={onGestureEvent}>
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