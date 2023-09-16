import React from 'react';
import { View, Text, Modal, Button } from 'react-native';

const ModalComp = ({ visible, onClose }: propsTypes) => (
    <Modal visible={visible} transparent animationType="slide">
        <View style={{
            flex: 1, justifyContent: 'center', alignItems: 'center',
            backgroundColor: "rgba(0, 0, 0, 0.8)"
        }}>
            <View style={{ backgroundColor: 'white', padding: 20, marginHorizontal: 10, borderRadius: 10 }}>
                <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center', color: "black" }}>Checkmate for Servers!</Text>
                <Text style={{ marginBottom: 20, textAlign: 'center', borderRadius: 30 }}>
                    Failed to Connect To Server, Close the App and try again later
                </Text>
                <Button title="Exit" onPress={onClose} />
            </View>
        </View>
    </Modal>
);

export default ModalComp;

interface propsTypes {
    visible: boolean;
    onClose: any
}