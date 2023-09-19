import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity, Text, ActivityIndicator, BackHandler, Clipboard, ToastAndroid } from 'react-native';
import { Chess } from "chess.js";
import Board from './Board';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { context } from '../Utils/Context';
import ModalComp from '../Utils/Modal';
const callImg = require('../Assets/Others/Call.png');

const ChessComp = () => {

    const contextApi = context();
    const chessInstance: any = new Chess();

    const [ShowModal, setShowModal] = useState(false)
    const [inputFocused, setinputFocused] = useState(false)
    const [whoseTurn, setwhoseTurn] = useState('w')

    const [chessState, setchessState] = useState({
        player: 'w',
        board: chessInstance.board(),
        chessInstance: chessInstance //!not updating Remove
    })

    useEffect(() => {
        if (contextApi?.mySocketId?.length <= 0 || contextApi?.mySocketId?.length === undefined) {
            setShowModal(true)
        }
    }, [])

    const handlePress = () => {
        if (inputFocused) {
            if (contextApi?.whomToCall?.length != 0) {
                contextApi?.handleConnection();
            } else {
                ToastAndroid.show('Please Enter Connection id first !', ToastAndroid.SHORT);
            }
        } else {
            Clipboard.setString(contextApi?.mySocketId);
            ToastAndroid.show('Copied!   Share this id With Whom You want to Connect', ToastAndroid.SHORT);
        }
    }

    useEffect(() => {
        console.log(chessState.chessInstance.ascii())
        console.log(chessState.chessInstance.turn())
        setwhoseTurn(chessState.chessInstance.turn())
    }, [chessState])

    const handleFocus = () => {
        setinputFocused(true)
    }

    const closeApp = () => {
        BackHandler.exitApp()
        return true;
    }

    return (
        <GestureHandlerRootView>
            <View>
                {contextApi?.opponentSocketId?.length > 0 ? (<View style={styles.container}>
                    <View style={{ width: 370, height: 50, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 5, marginBottom: 5 }}>
                        <Text style={{
                            color: 'white',
                            textAlignVertical: "center",
                            fontWeight: "600",
                            marginRight: 10,
                            fontSize: 16,
                        }}>{contextApi?.yourSide === 'b' ? 'You' : 'Opponent'}</Text>
                        <Image style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            borderWidth: 2,
                            borderColor: whoseTurn === 'b' ? 'red' : '#00041f'
                        }} source={{
                            uri: 'https://www.pngfind.com/pngs/m/300-3001710_businessman-icon-png-man-in-suit-icon-png.png'
                        }} />
                    </View>

                    <Board chessState={chessState} setchessState={setchessState} />

                    <View style={{ width: 370, height: 50, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 5, marginTop: 5 }}>
                        <Image style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            borderWidth: 2,
                            borderColor: whoseTurn === 'w' ? 'red' : '#00041f'
                        }} source={{
                            uri: 'https://www.citypng.com/public/uploads/preview/transparent-hd-white-male-user-profile-icon-11637133256qticy7lqml.png?v=2023070910'
                        }} />
                        <Text style={{
                            color: 'white',
                            textAlignVertical: "center",
                            fontWeight: "600",
                            marginLeft: 10,
                            fontSize: 16
                        }}>{contextApi?.yourSide === 'w' ? 'You' : 'Opponent'}</Text>
                    </View>
                </View>) : (
                    <View style={styles.containerTextInput}>
                        <Image source={callImg} style={{ width: '100%', height: '50%', backgroundColor: 'transparent' }} />
                        <View style={{ marginTop: 200, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.inputText}> {inputFocused ? "Enter Connection id" : "Touch to Enter Player Connection id "}</Text>
                            <TextInput
                                onFocus={handleFocus}
                                style={styles.textInput}
                                onChangeText={(value) => contextApi?.setwhomToCall(value)}
                                value={inputFocused ? contextApi?.whomToCall?.length : contextApi?.mySocketId}
                                placeholder="Enter Friend's Connection id"
                            />
                        </View>
                        <TouchableOpacity onPress={handlePress} disabled={contextApi?.Loading} style={{ ...styles.button, backgroundColor: contextApi?.Loading || contextApi?.whomToCall?.length === 0 ? "#944048" : '#5e030c', }}>
                            {contextApi?.Loading ? (<ActivityIndicator size="small" color="white" />) : (<Text style={styles.buttonText}>{inputFocused ? "Connect" : "Copy Your id"}</Text>)}
                        </TouchableOpacity>
                    </View>)}
                <ModalComp visible={ShowModal} onClose={closeApp} />
            </View>
        </GestureHandlerRootView>
    )
}

export default ChessComp

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00041f',
    },
    containerTextInput: {
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#00041f',
    },
    inputText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
        width: '87%'
    },
    textInput: {
        height: 60,
        width: '87%',
        margin: 12,
        borderWidth: 3,
        borderColor: '#660000',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        color: 'black',
        fontSize: 16,
    },
    button: {
        borderRadius: 8,
        width: '40%',
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});