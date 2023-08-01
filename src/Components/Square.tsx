import { StyleSheet, View } from 'react-native';
import React from 'react';

const Square = ({ row, column }: { row: number; column: number; }) => {
    const offSet = row % 2 ? 0 : 1;
    return (
        <View style={styles(column, offSet).container}>
            {/* <Text>{column}</Text> */}
        </View>
    )
}

export default Square;

const styles = (column: number, offSet: number) => StyleSheet.create({
    container: {
        width: 45,
        height: 40,
        backgroundColor: (column + offSet) % 2 ? '#eeeed2' : '#769656'
    }
})