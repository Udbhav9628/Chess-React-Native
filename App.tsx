import Home from './src/Components/Home';
import React, { useEffect } from 'react';
import ChessComp from './src/Components/Chess';
import { PermissionsAndroid } from 'react-native';
import { MyContextProvider } from './src/Utils/Context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
	const requestAudioPermission = async () => {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
				{
					title: 'This App Audio Permission',
					message: 'This App needs Audio Permission',
					buttonNeutral: 'Ask Me Later',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				}
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log('You can use the Audio');
			} else {
				console.log('Audio permission denied');
			}
		} catch (err) {
			console.warn(err);
		}
	};

	useEffect(() => {
		requestAudioPermission();
	}, []);

	return (
		<MyContextProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName='Home'>
					<Stack.Screen
						name='Home'
						component={Home}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name='FriendPlay'
						component={ChessComp}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</MyContextProvider>
	);
};

export default App;
