import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfileScreen({ navigation }) {

    const username = useSelector((state) => state.users.value.username)



    return (
        <View style={styles.generalContainer}>
            <SafeAreaView />
            <Text>Profile de {username}</Text>
            <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
        </View>
    );
}
const styles = StyleSheet.create({
    generalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },


});
