import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/Components/Home';
import ChessComp from "./src/Components/Chess";
import { MyContextProvider } from "./src/Utils/Context";
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <MyContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="FriendPlay" component={ChessComp} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MyContextProvider>
  )
}

export default App;