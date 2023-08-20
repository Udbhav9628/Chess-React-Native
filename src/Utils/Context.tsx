import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import io from "socket.io-client";
const socket = io("http://10.0.0.13:8000");
// import Peer from "simple-peer";

interface MyContextValue {
    socket: any;
    handleConnection: () => void;
    whomToCall: any;
    setwhomToCall: any;
    mySocketId: any;
    Loading: any;
    opponentSocketId: any
}

const MyContext = createContext<MyContextValue | undefined>(undefined);

export const context = () => {
    return useContext(MyContext);
};

export const MyContextProvider = ({ children }: { children: any }) => {

    const [whomToCall, setwhomToCall] = useState("")
    const [Loading, setLoading] = useState(false)
    const [mySocketId, setmySocketId] = useState();
    const [newMove, setnewMove] = useState({})
    const [opponentSocketId, setopponentSocketId] = useState('');

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
        if (opponentSocketId.length > 0) {
            Alert.alert('My Opponent', `My Oppeonet id ---  ${opponentSocketId}`)
        }
    }, [opponentSocketId])

    return (
        <MyContext.Provider value={{ socket, handleConnection, whomToCall, setwhomToCall, mySocketId, Loading, opponentSocketId }}>
            {children}
        </MyContext.Provider>
    );
};