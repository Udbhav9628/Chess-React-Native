import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';

const Home = ({ navigation }: propsTypes) => {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>&#x265B;</Text>
            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#030761', '#fc03a9']} style={styles.box}>
                <TouchableOpacity style={styles.Touchable}>
                    <Text style={styles.boxChildren1}>&#9822;</Text>
                    <Text style={styles.boxChildren2}>Play Random</Text>
                </TouchableOpacity>
            </LinearGradient>

            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#030761', '#fc0303']} style={styles.box}>
                <TouchableOpacity onPress={() => { navigation.navigate('FriendPlay') }} style={styles.Touchable}>
                    <Text style={styles.boxChildren1}>&#9823;</Text>
                    <Text style={styles.boxChildren2}>Play Friend</Text>
                </TouchableOpacity>
            </LinearGradient>
            {/* <Entry modalVisible={modalVisible} setModalVisible={setmodalVisible} /> */}
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00041f',
        alignContent: 'center'
    },
    logo: {
        fontSize: 100,
        color: 'white',
        marginBottom: 30,
        marginTop: '30%',
        textAlign: 'center'
    },
    box: {
        width: '85%',
        height: '20%',
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

interface propsTypes {
    navigation: any;
}