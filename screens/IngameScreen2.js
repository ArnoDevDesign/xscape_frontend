import React, { useEffect, useState, useRef, } from "react";
import { StyleSheet, View, SafeAreaView, Button, TextInput, Text, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { CameraView, CameraType, FlashMode } from 'expo-camera';
import _FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Video from 'expo-video';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';


export default function IngameScreen2() {
    const isFocused = useIsFocused();
    const cameraRef = useRef < CameraView | null > (null);
    const [hasPermission, setHasPermission] = useState(false);
    const [facing, setFacing] = useState < CameraType > ("back");
    const [flash, setFlash] = useState < FlashMode > ("off");
    const [scanned, setScanned] = useState < string | null > (null);
    const [scanned1, setScanned1] = useState(false);
    const [scanned2, setScanned2] = useState(false);
    const [scanned3, setScanned3] = useState(false);


    function scanQR(data) {
        console.log("QR Code Data:", data);
        if (data === 'https://qr.codes/vUIYq1') {
            setScanned1(true);
        } else if (data === 'https://qr.codes/FBPR2y') {
            if (scanned1) {
                setScanned2(true);
            } else {
                setScanned1(false);
            }
        } else if (data === 'https://qr-code.click/i/67bf284e705af') {
            if (scanned1 && scanned2) {
                setScanned3(true);
            } else {
                setScanned1(false);
                setScanned2(false);
            }
        } if (scanned1 && scanned2 && scanned3) { setJoVideo(true) }
    }
    return (

        <View>
            <Text>game 2 </Text>
        </View>



    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        // backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        width: 300,
        height: 300,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})