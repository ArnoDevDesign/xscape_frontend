import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, Modal, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToStore, userLogout } from '../reducers/users'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const URL = process.env.EXPO_PUBLIC_BACKEND_URL
export default function EndScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <Text>EndScreen</Text>
            <Button title='Home' onPress={() => navigation.navigate('Home')}></Button>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'green',
        justifyContent: "center",
        alignItems: 'center'
    }

})