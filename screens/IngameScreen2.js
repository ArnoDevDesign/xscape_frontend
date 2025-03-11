import React, { useEffect, useState, useRef } from "react";
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


export default function IngameScreen2({ navigation }) {
    const userRedux = useSelector((state) => state.users.value)

    const isFocused = useIsFocused();

    const cameraRef = useRef(null);


    const [hasPermission, setHasPermission] = useState(false);


    const [scanned1, setScanned1] = useState(false);
    const [scanned2, setScanned2] = useState(false);
    const [scanned3, setScanned3] = useState(false);
    const [SCORE, setSCORE] = useState(500);

    const [modalreveal, setModalreveal] = useState(false);
    const [indiceModal, setIndicemodal] = useState(false);

    const [game2, setGame2] = useState(false);
    const [flashColor, setFlashColor] = useState("transparent");

    const [goodQRcode1, setGoodQRcode1] = useState('https://qr.codes/vUIYq1');
    const [goodQRcode2, setGoodQRcode2] = useState('https://qr.codes/FBPR2y');
    const [goodQRcode3, setGoodQRcode3] = useState('https://qr-code.click/i/67bf284e705af');
    const [indice1, setIndice1] = useState('SCANNE TOUS LES QR CODES POSSIBLES ATTENTION L ORDRE DE SCAN EST PRIMORDIAL');

    const flashAnim = useRef(new Animated.Value(0)).current;

    const flashScreen = (color) => {
        flashAnim.setValue(1);
        setFlashColor(color);
        Animated.timing(flashAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start();
    };


    const shadowAnim = useRef(new Animated.Value(10)).current;


    useEffect(() => {
        fetch(`${URL}/scenarios/etapes/${userRedux.scenarioID}/${userRedux.userID}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setGoodQRcode1(data.expectedAnswer1);
                setGoodQRcode2(data.expectedAnswer2);
                setGoodQRcode3(data.expectedAnswer3);
                setIndice1(data.indice1);
            })
            .catch((error) => {
                console.error('Error:', error.message);
            });
    }, [userRedux.userID, userRedux.scenarioID]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shadowAnim, { toValue: 30, duration: 1000, useNativeDriver: false }),
                Animated.timing(shadowAnim, { toValue: 10, duration: 1000, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    const animatedStyle = {
        shadowRadius: shadowAnim,
        shadowOpacity: shadowAnim.interpolate({
            inputRange: [10, 20],
            outputRange: [0.5, 1],
        }),
    };


    const [isScanning, setIsScanning] = useState(true);

    const scanQR = (data) => {
        if (!isScanning) return;

        console.log("QR Code Data:", data);

        if (!scanned1 && data === goodQRcode1) {
            flashScreen("green");
            setScanned1(true);
            setIsScanning(false);
            setTimeout(() => setIsScanning(true), 3000);
        } else if (!scanned2 && scanned1 && data === goodQRcode2) {
            flashScreen("green");
            setScanned2(true);
            setIsScanning(false);
            setTimeout(() => setIsScanning(true), 3000);
        } else if (!scanned3 && scanned1 && scanned2 && data === goodQRcode3) {
            flashScreen("green");
            setScanned3(true);
            setIsScanning(false);
            setTimeout(() => {
                setModalreveal(true);
                setIsScanning(true);
            }, 1000);
        } else {
            flashScreen("red");
            setScanned1(false);
            setScanned2(false);
            setScanned3(false);
            Vibration.vibrate();
            setIsScanning(false);
            setTimeout(() => setIsScanning(true), 2000);
        }
    };



    function INDICE() {
        setSCORE(prevScore => prevScore - 100)
        setIndicemodal(false);
    }



    useEffect(() => {
        (async () => {
            const result = await Camera.requestCameraPermissionsAsync();
            setHasPermission(result && result?.status === 'granted');
        })();
    }, []);

    if (!hasPermission) {
        return <View />;
    }

    const passageau3 = () => {
        setGame2(true);

        setTimeout(() => {
            console.log("game2 status", game2, "score", SCORE);

            fetch(`${URL}/scenarios/ValidedAndScore/${userRedux.scenarioID}/${userRedux.userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score: SCORE, result: true }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Score mis à jour dans la base de données", data);
                    navigation.navigate("Ingame3");
                })
                .catch(error => {
                    console.error('Erreur lors de la requête:', error);
                });

        }, 1000);

        setModalreveal(false);
    };


    if (!isFocused) return null;

    return (

        isFocused && (
            <View style={styles.container} >
                <SafeAreaView />

                <View style={styles.CameraView} >
                    {hasPermission && (
                        <CameraView
                            onBarcodeScanned={({ data }) => scanQR(data)}
                            style={styles.Camera}
                            ref={cameraRef}
                        />
                    )}
                </View >
                <View style={styles.lightContainer}>
                    <Animated.View style={[styles.light, scanned1 ? styles.greenLight : styles.redLight, animatedStyle]} />
                    <Animated.View style={[styles.light, scanned2 ? styles.greenLight : styles.redLight, animatedStyle]} />
                    <Animated.View style={[styles.light, scanned3 ? styles.greenLight : styles.redLight, animatedStyle]} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => setIndicemodal(true)} style={styles.button}>
                        <Text style={styles.textButton}>Indice</Text>
                    </TouchableOpacity>
                </View>


                <Animated.View style={[styles.flashOverlay, {
                    opacity: flashAnim,
                    backgroundColor: flashColor
                }]} />



                {
                    indiceModal && (
                        <Modal visible={indiceModal} animationType="fade" transparent>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <TouchableOpacity onPress={INDICE} style={styles.button}>
                                        <Text style={styles.textButton}>{indice1}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )
                }
                {
                    modalreveal && (
                        <Modal visible={modalreveal} animationType="fade" transparent>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <TouchableOpacity onPress={passageau3} style={styles.button}>
                                        <Text style={styles.textButton}>✅ Triangulation réussie ! La capsule a été localisée.</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )
                }
            </View >))
}


const styles = StyleSheet.create({
    light: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'white',
        elevation: 10,
    },
    greenLight: {
        backgroundColor: 'rgba(0, 255, 0, 0.7)',
        shadowColor: 'rgba(0, 255, 0, 1)',
    },
    redLight: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        shadowColor: 'rgba(255, 0, 0, 1)',
    },
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    CameraView: {
        width: '100%',
        height: '50%',
        borderWidth: 5,
        borderColor: 'gray',
    },
    Camera: {
        width: '100%',
        height: '100%',
    },
    lightContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
    },
    light: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: 'rgba(255, 255, 255, 0.8)',
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 10,
    },
    greenLight: {
        backgroundColor: 'rgba(0, 255, 0, 0.7)',
        shadowColor: 'rgba(0, 255, 0, 1)',
    },
    redLight: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        shadowColor: 'rgba(255, 0, 0, 1)',
    },
    flashOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    button: {
        backgroundColor: "#1E90FF",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    textButton: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
