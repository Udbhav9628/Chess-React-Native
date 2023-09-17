import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity, Text, ActivityIndicator, BackHandler } from 'react-native';
import { Chess } from "chess.js";
import Board from './Board';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { context } from '../Utils/Context';
import ModalComp from '../Utils/Modal';
const callImg = require('../Assets/Others/Call.png');
import { useClipboard } from '@react-native-clipboard/clipboard';

const ChessComp = () => {

    const contextApi = context();
    const chessInstance: any = new Chess();

    const [ShowModal, setShowModal] = useState(false)
    const [inputFocused, setinputFocused] = useState(false)

    const [chessState, setchessState] = useState({
        player: 'w',
        board: chessInstance.board(),
        chessInstance: chessInstance
    })

    useEffect(() => {
        if (contextApi?.mySocketId?.length <= 0 || contextApi?.mySocketId?.length === undefined) {
            setShowModal(true)
        }
    }, [])

    const [data, setString] = useClipboard();
    const copyToClipboard = () => {
        setString('hello world');
    };


    // useEffect(() => {
    //     console.log(chessState.chessInstance.ascii())
    //     console.log(chessState.chessInstance.turn())
    // }, [chessState])

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
                    <Board chessState={chessState} setchessState={setchessState} />
                </View>) : (<View style={styles.containerTextInput}>
                    <Image source={callImg} style={{ width: '100%', height: '50%', backgroundColor: 'transparent' }} />
                    <TextInput
                        onFocus={handleFocus}
                        style={styles.textInput}
                        onChangeText={(value) => contextApi?.setwhomToCall(value)}
                        value={inputFocused ? contextApi?.whomToCall?.length : contextApi?.mySocketId}
                        placeholder="Enter Friend's Connection id"
                    />
                    <TouchableOpacity onPress={copyToClipboard} disabled={contextApi?.Loading || contextApi?.whomToCall?.length === 0} style={{ ...styles.button, backgroundColor: contextApi?.Loading || contextApi?.whomToCall?.length === 0 ? "#944048" : '#5e030c', }}>
                        {contextApi?.Loading ? (<ActivityIndicator size="small" color="white" />) : (<Text style={styles.buttonText}>{inputFocused ? "Connect" : "Copy Id"}</Text>)}
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
    textInput: {
        height: 60,
        width: '87%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        color: 'black',
        fontSize: 16,
        marginTop: 200
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