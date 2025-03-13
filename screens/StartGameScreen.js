import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, ImageBackground, Modal, TextInput, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToStore, userLogout } from '../reducers/users'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFonts } from "expo-font";

const URL = process.env.EXPO_PUBLIC_BACKEND_URL
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();



export default function StartGameScreen({ navigation }) {
    const [loaded] = useFonts({
        "PressStart2P-Regular.ttf": require("../assets/fonts/PressStart2P-Regular.ttf"),
        "Goldman-Regular.ttf": require("../assets/fonts/Goldman-Regular.ttf"),
        "Goldman-Bold.ttf": require("../assets/fonts/Goldman-Bold.ttf"),
    });
    useEffect(() => {
        // cacher l'écran de démarrage si la police est chargée ou s'il y a une erreur
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    // Retourner null tant que la police n'est pas chargée
    if (!loaded) {
        return null;
    }



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
            <ImageBackground source={require('../assets/imgsAventure/FondAventure01X.png')} resizeMode='stretch' style={styles.imageBackground}>

                <SafeAreaView />
                <View style={styles.imgContainer}>
                    <ImageBackground source={require('../assets/imgsAventure/MmodaleX.png')} resizeMode='stretch' style={styles.imageBackground}>
                        <View style={styles.textcontainer}>
                            <Text style={styles.text}>{text}</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.replace('Ingame1')} style={styles.button}>
                        <ImageBackground source={require('../assets/imgsAventure/bbtnOffX.png')} resizeMode='stretch' style={styles.imgBtn}>
                            <Text style={styles.text}>Go !</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View >
            </ImageBackground>
        </View >
    );;
}


const styles = StyleSheet.create({
    text: {
        color: 'green',
        fontSize: 20,
        fontFamily: "Goldman-Regular.ttf",
    },
    textcontainer: {
        width: '80%',
        height: '75%',
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: 'red',
        // borderWidth: 5,
    },
    imgBtn: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '90%',
        height: 70,
        marginTop: 20,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },

    imgContainer: {

        paddingTop: 70,
        width: '90%',
        height: '80%',
        // backgroundColor: 'red',
        // justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
        flex: 1,
        height: '100%',
        width: '100%',

        backgroundColor: 'black',
        jusityfyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        // backgroundColor: 'blue',
        marginTop: 20,
        width: '100%',
        height: '30%',
        // flexDirection: 'row',
        // justifyContent: 'center',
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
        borderWidth: 5,
        borderColor: 'green',
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