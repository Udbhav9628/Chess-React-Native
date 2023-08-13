import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Entry from "./src/Components/index";
import LinearGradient from 'react-native-linear-gradient';
// import Logo from '../Assets/Pieces/rook4-w.svg';

const App = () => {

  const [modalVisible, setmodalVisible] = useState(false)

  const handleBox1Press = () => {
    setmodalVisible(true)
  }

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <StatusBar
          animated={true}
          backgroundColor='#00041f'
        />
        <Text style={styles.logo}>&#x265B;</Text>
        <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#030761', '#fc03a9']} style={styles.box}>
          <TouchableOpacity style={styles.Touchable}>
            <Text style={styles.boxChildren1}>&#9822;</Text>
            <Text style={styles.boxChildren2}>Play Random</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#030761', '#fc0303']} style={styles.box}>
          <TouchableOpacity onPress={handleBox1Press} style={styles.Touchable}>
            <Text style={styles.boxChildren1}>&#9823;</Text>
            <Text style={styles.boxChildren2}>Play Friend</Text>
          </TouchableOpacity>
        </LinearGradient>
        <Entry modalVisible={modalVisible} setModalVisible={setmodalVisible} />
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#00041f',
    alignContent: 'center',
    justifyContent: 'space-around'
  },
  logo: {
    fontSize: 100,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center'
  },
  box: {
    width: '85%',
    height: '25%',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 30
  },
  Touchable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  boxChildren1: {
    flex: 0.4,
    color: 'white',
    fontSize: 100,
    textAlign: 'center'
  },
  boxChildren2: {
    flex: 0.6,
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})