import { StyleSheet, View } from 'react-native';
import React from 'react';

const Square = ({ row, column }: { row: number; column: number; }) => {
    return (
        <View style={styles(column, row).container}>
            {/* <Text>{column}</Text> */}
        </View>
    )
}

export default Square;

const styles = (column: number, row: number) => StyleSheet.create({
    container: {
        width: 45,
        height: 40,
        backgroundColor: (column + row) % 2 ? '#eeeed2' : '#769656'
    }
})