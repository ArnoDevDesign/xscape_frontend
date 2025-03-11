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
    // Initialisation de la navigation pour permettre la transition vers l’étape 3
    const isFocused = useIsFocused();
    // Référence pour l’accès à la caméra
    const cameraRef = useRef(null);

    // État pour gérer l’autorisation d’accès à la caméra
    const [hasPermission, setHasPermission] = useState(false);

    // États pour savoir si chaque QR Code a été scanné
    const [scanned1, setScanned1] = useState(false);
    const [scanned2, setScanned2] = useState(false);
    const [scanned3, setScanned3] = useState(false);
    const [SCORE, setSCORE] = useState(500);
    // État pour afficher le message final une fois tous les scans validés
    const [modalreveal, setModalreveal] = useState(false);
    const [indiceModal, setIndicemodal] = useState(false);
    // Valeurs des QR Codes attendus (doivent être scannés dans cet ordre précis)
    const [game2, setGame2] = useState(false);
    const [flashColor, setFlashColor] = useState("transparent");

    const [goodQRcode1, setGoodQRcode1] = useState('https://qr.codes/vUIYq1');
    const [goodQRcode2, setGoodQRcode2] = useState('https://qr.codes/FBPR2y');
    const [goodQRcode3, setGoodQRcode3] = useState('https://qr-code.click/i/67bf284e705af');
    const [indice1, setIndice1] = useState('SCANNE TOUS LES QR CODES POSSIBLES ATTENTION L ORDRE DE SCAN EST PRIMORDIAL');
    // Animation pour un effet futuriste (flash rouge/vert lorsqu’un QR est scanné)
    const flashAnim = useRef(new Animated.Value(0)).current;

    const flashScreen = (color) => {
        flashAnim.setValue(1);
        setFlashColor(color); // Met à jour l'état pour définir la couleur
        Animated.timing(flashAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start();
    };

    // Créer une animation pour simuler la pulsation de la lumière
    // Référence pour l'animation du halo lumineux
    const shadowAnim = useRef(new Animated.Value(10)).current;


    useEffect(() => {
        fetch(`${URL}/scenarios/etapes/${userRedux.scenarioID}/${userRedux.userID}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setGoodQRcode1(data.goodFrequence1);
                setGoodQRcode2(data.goodFrequence2);
                setGoodQRcode3(data.goodFrequence3);
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
        shadowRadius: shadowAnim, // Rayon du halo qui varie en boucle
        shadowOpacity: shadowAnim.interpolate({
            inputRange: [10, 20],
            outputRange: [0.5, 1], // Opacité qui fluctue avec l'ombre
        }),
    };

    // Fonction qui gère la lecture des QR codes et vérifie s’ils sont scannés dans le bon ordre
    const [isScanning, setIsScanning] = useState(true); // Permet de bloquer temporairement le scan

    const scanQR = (data) => {
        if (!isScanning) return;  // Si le scan est bloqué, on ne fait rien

        console.log("QR Code Data:", data);

        if (!scanned1 && data === goodQRcode1) {
            flashScreen("green");  // Flash vert
            setScanned1(true);
            setIsScanning(false); // Désactiver temporairement le scan
            setTimeout(() => setIsScanning(true), 3000); // Réactiver après 2s
        } else if (!scanned2 && scanned1 && data === goodQRcode2) {
            flashScreen("green");  // Flash vert
            setScanned2(true);
            setIsScanning(false);
            setTimeout(() => setIsScanning(true), 3000);
        } else if (!scanned3 && scanned1 && scanned2 && data === goodQRcode3) {
            flashScreen("green");  // Flash vert
            setScanned3(true);
            setIsScanning(false);
            setTimeout(() => {
                setModalreveal(true);
                setIsScanning(true); // Réactiver après affichage du modal
            }, 1000);
        } else {
            flashScreen("red"); // Flash rouge pour un mauvais scan
            setScanned1(false);
            setScanned2(false);
            setScanned3(false);
            Vibration.vibrate();
            setIsScanning(false);
            setTimeout(() => setIsScanning(true), 2000); // Réactiver après 2s
        }
    };


    // Fonction qui permet de passer à l’étape 3 après la validation

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
        console.log('game2 status', game2, 'score', SCORE)
        useEffect(() => {
            if (game2) {  // Vérifier que le score n'a pas déjà été envoyé
                console.log("Score mis à jour, envoi au backend:", SCORE);

                fetch(`${URL}/scenarios/ValidedAndScore/${userRedux.scenarioID}/${userRedux.userID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ score: SCORE, result: game2 }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Score mis à jour dans la base de données", data);
                        navigation.navigate("Ingame3"); // Naviguer après la mise à jour


                    })
                    .catch(error => {
                        console.error('Erreur lors de la requête:', error);
                    });
            }
        }, [SCORE])


        setModalreveal(false);
        navigation.navigate('Ingame3');
    };



    return (
        isFocused && (
            <View style={styles.container} >
                <SafeAreaView />

                {/* Vue de la caméra pour scanner les QR Codes */}
                <View style={styles.CameraView} >
                    {hasPermission && (
                        <CameraView
                            onBarcodeScanned={({ data }) => scanQR(data)} // Appelle scanQR lorsqu'un QR est scanné
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

                {/* Animation Flash */}
                <Animated.View style={[styles.flashOverlay, {
                    opacity: flashAnim,
                    backgroundColor: flashColor
                }]} />


                {/* Modal qui s'affiche après le scan réussi des 3 QR codes */}
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
        width: 80,  // Taille fixe de la lumière
        height: 80,
        borderRadius: 40, // Cercle parfait
        borderWidth: 3,
        borderColor: 'white',
        elevation: 10, // Effet 3D sur Android
    },
    greenLight: {
        backgroundColor: 'rgba(0, 255, 0, 0.7)', // Lumière verte semi-transparente
        shadowColor: 'rgba(0, 255, 0, 1)', // Halo lumineux vert
    },
    redLight: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)', // Lumière rouge semi-transparente
        shadowColor: 'rgba(255, 0, 0, 1)', // Halo lumineux rouge
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
        width: 100,
        height: 100,
        borderRadius: 30, // Cercle lumineux
        borderWidth: 3,
        borderColor: 'white',
    },
    lightContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
    },
    light: {
        width: 80,  // Augmenter la taille pour accentuer l’effet de lumière
        height: 80,
        borderRadius: 40, // Cercle parfait
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: 'rgba(255, 255, 255, 0.8)', // Ajout d’un halo lumineux
        shadowOpacity: 1,
        shadowRadius: 20, // Rayon du halo lumineux
        elevation: 10, // Pour donner un effet en 3D sur Android
    },
    greenLight: {
        backgroundColor: 'rgba(0, 255, 0, 0.7)', // Lumière verte semi-transparente
        shadowColor: 'rgba(0, 255, 0, 1)', // Halo lumineux vert
    },
    redLight: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)', // Lumière rouge semi-transparente
        shadowColor: 'rgba(255, 0, 0, 1)', // Halo lumineux rouge
    },
    flashOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent", // Sera remplacé dynamiquement
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
