import { StyleSheet, View } from 'react-native'
import React from 'react'
import Square from './Square'

const Row = ({ row }: { row: number }) => {
    return (
        <View style={styles.container}>
            {
                new Array(8).fill(0).map((_, index) => (<Square key={index} row={row} column={index} />))
            }
        </View>
    )
}

export default Row

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    }
})