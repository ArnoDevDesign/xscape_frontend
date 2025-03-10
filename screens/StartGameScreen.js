import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, ImageBackground, Modal, TextInput, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToStore, userLogout } from '../reducers/users'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const URL = process.env.EXPO_PUBLIC_BACKEND_URL




export default function StartGameScreen({ navigation }) {

    const userRedux = useSelector((state) => state.users.value);
    const [text, setText] = useState('');

    //////////////////////////////////////// a verifier /////////////////////////////////////////
    useEffect(() => {
        console.log('scenario id ', userRedux)
        fetch(`${URL}/scenarios/descriptionEpreuve/${userRedux.scenarioID}/${userRedux.userID}`)/////////// averifier
            .then(response => response.json())
            .then(data => {
                console.log('data', data)
                setText(data.descriptionEpreuveData)
            })
            .catch(err => console.log(err))
    }, [userRedux, text])
    //////////////////////////////////////// a verifier /////////////////////////////////////////

    console.log('textlogg', text)

    return (
        <View style={styles.container}>
            <SafeAreaView />
            <View style={styles.imgcontainer}>
                <Text style={styles.textButton}>{text}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
                    <Text style={styles.text}>sortir</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Ingame')} style={styles.button}>
                    <Text style={styles.text}>Go !</Text>
                </TouchableOpacity>
            </View>
        </View>
    );;
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        padding: 20,
        backgroundColor: 'black',
        jusityfyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        height: '40%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imgcontainer: {
        width: '100%',
        height: '60%',
    },
    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textContainer2: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 220,
        height: 200,
    },
    textContainer: {
        // borderWidth: 5,
        // justifyContent: 'center',
        // alignItems: 'center',
        width: 220,
        height: 150,

    },
    textButton: {
        color: "green",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,

    }


})