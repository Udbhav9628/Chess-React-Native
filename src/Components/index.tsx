import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, TextInput, View, Image, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { Chess } from "chess.js";
import Board from './Board';
const callImg = require('../Assets/Others/Call.png');
import io from "socket.io-client";
// import Peer from "simple-peer";

const socket = io("http://192.168.124.232:8000");

const index = ({ modalVisible, setModalVisible }: propsTypes) => {

    const chessInstance: any = new Chess();

    const [whomToCall, setwhomToCall] = useState('')
    const [Loading, setLoading] = useState(false)
    const [mySocketId, setmySocketId] = useState();
    const [newMove, setnewMove] = useState({})
    const [opponentSocketId, setopponentSocketId] = useState('');


    const [chessState, setchessState] = useState({
        player: 'w',
        board: chessInstance.board(),
        chessInstance: chessInstance
    })

    useEffect(() => {
        console.log(chessState.chessInstance.ascii())
        console.log(chessState.chessInstance.turn())
    }, [chessState])

    const handleConnection = () => {
        setLoading(true)
        socket.emit("callUser", { userTocall: whomToCall, from: mySocketId });
    }

    useEffect(() => {
        socket.on("me", (id) => setmySocketId(id));

        socket.on("callUser", ({ from, userId }) => {
            Alert.alert('Connection Request', 'Someone is Trying to Connect', [
                {
                    text: 'Decline',
                    style: 'cancel',
                },
                {
                    text: 'Connect',
                    onPress: () => {
                        //// to -- whom with call has been established
                        socket.emit("answerCall", { to: from, opponent: userId });
                        setModalVisible(true)
                        setopponentSocketId(from)
                        setLoading(false)
                    },
                }
            ]);
        });

        socket.on("callAccepted", (opponent) => {
            setopponentSocketId(opponent)
        });

        socket.on('chessMove', (moveObj) => {
            console.log('New Chess Move');
            console.log(moveObj);
            setnewMove(moveObj);
        })
    }, [])

    useEffect(() => {
        console.log('My Socket Id ---', ' - ', mySocketId);
    }, [mySocketId])

    useEffect(() => {
        Alert.alert('My Opponent', `My Oppeonet id ---  ${opponentSocketId}`)
    }, [opponentSocketId])


    return (
        <Modal
            animationType='slide'
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            {opponentSocketId.length > 0 ? (<View style={styles.container}>
                <Board chessState={chessState} setchessState={setchessState} socket={socket} />
            </View>) : (<View style={styles.containerTextInput}>
                <Image source={callImg} style={{ width: '100%', height: '50%', backgroundColor: 'transparent' }} />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(value) => setwhomToCall(value)}
                    value={whomToCall}
                    placeholder="Enter Friend's Connection id"
                />
                <TouchableOpacity disabled={Loading || whomToCall?.length === 0} onPress={handleConnection} style={{ ...styles.button, backgroundColor: Loading || whomToCall?.length === 0 ? "#944048" : '#5e030c', }}>
                    {Loading ? (<ActivityIndicator size="small" color="white" />) : (<Text style={styles.buttonText}>Connect</Text>)}
                </TouchableOpacity>
            </View>)}
        </Modal>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00041f',
    },
    containerTextInput: {
        flex: 1,
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

interface propsTypes {
    modalVisible: boolean
    setModalVisible: Function
}