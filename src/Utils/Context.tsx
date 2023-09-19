import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import io from "socket.io-client";
const socket = io("http://192.168.1.8:8000");
// import Peer from "simple-peer";

interface MyContextValue {
    socket: any;
    handleConnection: () => void;
    whomToCall: any;
    setwhomToCall: any;
    mySocketId: any;
    Loading: any;
    opponentSocketId: any;
    newMove: any;
    yourSide: string
}

const MyContext = createContext<MyContextValue | undefined>(undefined);

export const context = () => {
    return useContext(MyContext);
};

export const MyContextProvider = ({ children }: { children: any }) => {

    const [whomToCall, setwhomToCall] = useState("")
    const [Loading, setLoading] = useState(false);
    const [mySocketId, setmySocketId] = useState();
    const [newMove, setnewMove] = useState({
        From: '',
        To: ''
    });
    const [opponentSocketId, setopponentSocketId] = useState('');
    const [yourSide, setyourSide] = useState('');

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
                        setyourSide('b')
                        setopponentSocketId(from)
                        setLoading(false)
                    },
                }
            ]);
        });

        socket.on("callAccepted", (opponent) => {
            setyourSide('w')
            setopponentSocketId(opponent)
        });

        // socket.on('chessMove', (moveObj) => {
        //     setnewMove(moveObj);
        // })
    }, [])

    useEffect(() => {
        console.log('My Socket Id ---', ' - ', mySocketId);
    }, [mySocketId])

    useEffect(() => {
        if (opponentSocketId?.length > 0) {
            Alert.alert('My Opponent', `My Oppeonet id ---  ${opponentSocketId}`)
        }
    }, [opponentSocketId])

    return (
        <MyContext.Provider value={{ socket, handleConnection, whomToCall, setwhomToCall, mySocketId, Loading, opponentSocketId, newMove, yourSide }}>
            {children}
        </MyContext.Provider>
    );
};