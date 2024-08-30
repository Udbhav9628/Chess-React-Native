import io from 'socket.io-client';
import { Alert } from 'react-native';
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
} from 'react';
// import {
// 	RTCPeerConnection,
// 	mediaDevices,
// 	RTCSessionDescription,
// 	RTCIceCandidate,
// } from 'react-native-webrtc';

import {
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals,
} from 'react-native-webrtc';

const socket = io('http://192.168.193.17:8000');
interface MyContextValue {
	socket: any;
	handleConnection: () => void;
	whomToCall: any;
	setwhomToCall: any;
	mySocketId: any;
	Loading: any;
	opponentSocketId: any;
	yourSide: string;
	handleRandomConnection: any;
}

const MyContext = createContext<MyContextValue | undefined>(undefined);

export const context = () => {
	return useContext(MyContext);
};

export const MyContextProvider = ({ children }: { children: any }) => {
	const [whomToCall, setwhomToCall] = useState('');
	const [Loading, setLoading] = useState(false);
	const [mySocketId, setmySocketId] = useState();
	const [opponentSocketId, setopponentSocketId] = useState('');
	const [yourSide, setyourSide] = useState('');
	const [callType, setCallType] = useState('');
	const [localStream, setlocalStream] = useState<any>(null);
	const [remoteStream, setRemoteStream] = useState(null);
	const RemoteUserId = useRef('');

	const peerConnection = useRef<any>();

	const servers = {
		iceServers: [
			{
				urls: [
					'stun:stun1.l.google.com:19302',
					'stun:stun2.l.google.com:19302',
				],
			},
		],
		iceCandidatePoolSize: 10,
	};

	const webRtc = async () => {
		try {
			peerConnection.current = new RTCPeerConnection(servers);

			const mediaStream = await mediaDevices.getUserMedia({
				audio: true,
				video: {
					frameRate: 30,
					facingMode: 'user',
				},
			});
			console.log('Here --- 1');

			let videoTrack = mediaStream.getVideoTracks()[0];
			videoTrack.enabled = false;

			setlocalStream(mediaStream);
			mediaStream.getTracks().forEach((track) => {
				peerConnection.current.addTrack(track, mediaStream);
			});

			console.log('Here --- 2 ---', peerConnection);

			peerConnection.current.addStream(localStream);

			console.log('Here --- 3');

			peerConnection.current.onicecandidate = (event: any) => {
				if (event.candidate) {
					console.log('In setting up the candidate');
					socket.emit('ICEcandidate', {
						calleeId: RemoteUserId.current,
						rtcMessage: {
							label: event.candidate.sdpMLineIndex,
							id: event.candidate.sdpMid,
							candidate: event.candidate.candidate,
						},
					});
				} else {
					console.log('IceCandidate does not Exist, End of candidates.');
				}
			};

			console.log('Here --- 4');

			socket.on('ICEcandidate', (data) => {
				let message = data.rtcMessage;
				if (peerConnection.current) {
					peerConnection?.current
						.addIceCandidate(
							new RTCIceCandidate({
								candidate: message.candidate,
								sdpMid: message.id,
								sdpMLineIndex: message.label,
							})
						)
						.then((data: any) => {
							console.log('SUCCESS');
						})
						.catch((err: any) => {
							console.log('Error', err);
						});
				}
			});

			peerConnection.current.onaddstream = (event: any) => {
				console.log('This is remote stream -', event);

				setRemoteStream(event.stream);
			};
		} catch (error) {
			console.log('Error in WebRtc  -', error);
		}
	};

	//async function declared and invoked directly here
	useEffect(() => {
		(async () => {
			await webRtc();
		})();
	}, []);

	const handleConnection = async () => {
		try {
			const sessionDescription = await peerConnection.current.createOffer();
			await peerConnection.current.setLocalDescription(sessionDescription);

			setLoading(true);
			socket.emit('callUser', {
				userTocall: whomToCall,
				from: mySocketId,
				RTCsessionDescription: sessionDescription,
			});

			socket.on('callAccepted', (opponent, sessionDescription) => {
				setyourSide('w');
				setopponentSocketId(opponent);
				peerConnection.current.setRemoteDescription(
					new RTCSessionDescription(sessionDescription)
				);
			});
		} catch (error) {
			setLoading(false);
			console.log('error in handle Call --', error);
		}
	};

	const AnswerCall = async (
		from: React.SetStateAction<string>,
		userId: any,
		RtcRemoteSessionDescription: any
	) => {
		peerConnection.current.setRemoteDescription(
			new RTCSessionDescription(RtcRemoteSessionDescription)
		);
		const sessionDescription = await peerConnection.current.createAnswer();
		await peerConnection.current.setLocalDescription(sessionDescription);
		socket.emit('answerCall', {
			to: from,
			opponent: userId,
			sessionDescription,
		});
		setyourSide('b');
		setopponentSocketId(from);
		setLoading(false);
	};

	const handleRandomConnection = () => {
		socket.emit('randomCall', { whoIsCalling: mySocketId });
	};

	useEffect(() => {
		socket.on('me', (id) => setmySocketId(id));

		//!Listening Incomming Call
		socket.on('callUser', ({ from, userId, RTCsessionDescription }) => {
			RemoteUserId.current = from;
			Alert.alert('Connection Request', 'Someone is Trying to Connect', [
				{
					text: 'Decline',
					style: 'cancel',
				},
				{
					text: 'Connect',
					onPress: () => {
						AnswerCall(from, userId, RTCsessionDescription);
					},
				},
			]);
		});
	}, []);

	useEffect(() => {
		console.log('My Socket Id ---', ' - ', mySocketId);
	}, [mySocketId]);

	useEffect(() => {
		if (opponentSocketId?.length > 0) {
			Alert.alert('My Opponent', `My Oppeonet id --- ${opponentSocketId}`);
		}
	}, [opponentSocketId]);

	return (
		<MyContext.Provider
			value={{
				socket,
				handleConnection,
				whomToCall,
				setwhomToCall,
				mySocketId,
				Loading,
				opponentSocketId,
				yourSide,
				handleRandomConnection,
			}}
		>
			{children}
		</MyContext.Provider>
	);
};
