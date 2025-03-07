import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, ImageBackground, Modal, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToStore, userLogout } from '../reducers/users'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const URL = process.env.EXPO_PUBLIC_BACKEND_URL


export default function StartGameScreen({ navigation }) {

    const [modalout, setmodalout] = useState(false);



    return (
        <View style={styles.container}>
            <View style={styles.imgcontainer}>
                <ImageBackground source={require('../assets/modalEcran.png')} resizeMode='stretch' style={styles.imageBackground}>
                    <View style={styles.textContainer}>
                        <TouchableOpacity onPress={() => setmodalout(false)} style={styles.button}>
                            <Text style={styles.textButton}>Je suis pret !</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
                <Text style={styles.text}>sortir</Text>
            </TouchableOpacity>
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
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgcontainer: {
        width: '100%',
        height: '70%',
    },
    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textContainer: {
        // borderWidth: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 230,

    }


})