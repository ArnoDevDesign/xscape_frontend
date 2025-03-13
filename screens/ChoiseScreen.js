
import React, { useEffect, useState, useRef } from "react";
import { ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    Vibration
} from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { useNavigation } from "@react-navigation/native";
const useIsFocused = require('@react-navigation/native').useIsFocused;
const URL = process.env.EXPO_PUBLIC_BACKEND_URL


export default function ChoiceScreen({ navigation }) {
    <View style={styles.container}>
        <TouchableOpacity onPress={() => { setResponse(false), setModalChoice(false) }} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>reprendre a la derniere sauvegarde</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setResponse(true), setModalChoice(false) }} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>reprendre depuis le debut</Text>
        </TouchableOpacity>
    </View >

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButton: {
        backgroundColor: '#000000',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonText: {
        color: '#ffffff',
        fontSize: 20,
    },
});
