import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, Animated, ImageBackground, Image } from "react-native";
import { addUserToStore } from "../reducers/users";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
const URL = process.env.EXPO_PUBLIC_BACKEND_URL;


export default function Ingame3Screen({ navigation }) {
    const isFocused = useIsFocused();
    const userRedux = useSelector((state) => state.users.value)
    const [title, setTitle] = useState("Activez les boutons dans le bon ordre pour déminiaturiser La Capsule !");
    const [pressedOrder, setPressedOrder] = useState([]);
    const [attempts, setAttempts] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [score, setScore] = useState(500);
    const [game3, setGame3] = useState(false);
    const [bouton1, setbouton1] = useState('');
    const [bouton2, setbouton2] = useState('');
    const [bouton3, setbouton3] = useState('');
    const [bouton4, setbouton4] = useState('');
    const [indice1, setIndice1] = useState('');


    // Animation
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const dispatch = useDispatch();
    // Ordre correct des boutons
    const correctSequence = [1, 3, 4, 2];/* amettre dynamiquement en bdd */

    function handlePress(buttonNumber) {
        if (gameOver) return; // Empêcher les clics après un échec

        const newOrder = [...pressedOrder, buttonNumber];


        if (newOrder.every((num, index) => num === correctSequence[index])) {
            setPressedOrder(newOrder);

            if (newOrder.length === correctSequence.length) {
                setTitle("YES !!! Vous avez réussi à déminiaturiser la capsule ! ");
                setGame3(true);
            }
        } else {
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);

            // Déclenche l'animation de clignotement
            triggerShake();

            if (newAttempts === 0) {
                setTitle("ATTENTION ! plus qu'une chance , on est pret de l apocalypse !");
                setGameOver(true);
                setModalVisible(true);
                setScore(prevScore => prevScore - 100); // Décrémente le score
            } else {
                setTitle(` WOOOOOW ! tu as entendu ce bruit ??? C'est pas bon ça !!! Il reste ${newAttempts} essais.`);
                setPressedOrder([]);
            }
        }
    }

    useEffect(() => {
        fetch(`${URL}/scenarios/etapes/${userRedux.scenarioID}/${userRedux.userID}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setbouton1(data.text1);
                setbouton2(data.text2);
                setbouton3(data.text3);
                setbouton4(data.text4);
                setIndice1(data.indice1);
            })
            .catch((error) => {
                console.error('Error:', error.message);
            }
            )
    }, [userRedux.userID, userRedux.scenarioID, isFocused]);


    function triggerShake() {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: false }),
            Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: false }),
        ]).start();
    }

    function resetGame() {
        setModalVisible(false);
        setTitle("Essayez à nouveau !");
        setAttempts(3);
        setGameOver(false);
        setPressedOrder([]);
    }

    async function finishGame() {
        if (!game3) return; // Évite d'exécuter la fonction plusieurs fois si le jeu est déjà terminé

        try {
            const response = await fetch(`${URL}/scenarios/ValidedAndScore/${userRedux.scenarioID}/${userRedux.userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score: score, result: game3 }),
            });
            const data = await response.json();
            console.log("Score mis à jour dans la base de données", data);

            // Met à jour Redux avec les points totalisés
            dispatch(addUserToStore({ scoreSession: data.totalPointsSession }));

            // Attends un petit délai pour assurer la mise à jour avant la navigation
            setTimeout(() => {
                navigation.replace("End");
            }, 500);

        } catch (error) {
            console.error('Erreur lors de la requête:', error);
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/imgsAventure/FondAventure01X.png')} style={styles.ImageBackground}>
                <View style={styles.titleContainer}>
                    <View style={styles.titleContainerImage} >
                        <ImageBackground source={require('../assets/imgsAventure/modaleSimpleX.png')} style={styles.ImageTextHaut}>
                            <Text style={styles.title}>{title}</Text>
                        </ImageBackground>
                    </View>
                </View>
                <View style={styles.buttonContainerUp}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity disabled={gameOver} onPress={() => handlePress(1)} style={styles.metalButton}>
                            <ImageBackground source={require('../assets/imgsAventure/btnOffX.png')} style={styles.ImageButton}>
                                <Text style={styles.textButton}>{bouton1}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity disabled={gameOver} onPress={() => handlePress(2)} style={styles.metalButton}>
                            <ImageBackground source={require('../assets/imgsAventure/btnOffX.png')} style={styles.ImageButton}>
                                <Text style={styles.textButton}>{bouton2}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity disabled={gameOver} onPress={() => handlePress(3)} style={styles.metalButton}>
                            <ImageBackground source={require('../assets/imgsAventure/btnOffX.png')} style={styles.ImageButton}>
                                <Text style={styles.textButton}>{bouton3}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity disabled={gameOver} onPress={() => handlePress(4)} style={styles.metalButton}>
                            <ImageBackground source={require('../assets/imgsAventure/btnOffX.png')} resizeMode='stretch' style={styles.ImageButton}>
                                <Text style={styles.textButton}>{bouton4}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContentUp}>
                            <ImageBackground source={require('../assets/imgsAventure/modaleSimpleX.png')}
                                resizeMode="stretch" style={styles.ImageModalContent}>
                                <Text style={styles.modalText}>{indice1}</Text>
                            </ImageBackground>
                        </View>
                        <View style={styles.modalContentDown}>
                            <TouchableOpacity onPress={resetGame} style={styles.modalButton}>
                                <ImageBackground source={require('../assets/imgsAventure/bbtnOffX.png')}
                                    resizeMode="stretch" style={styles.modalButton}>
                                    <Text style={styles.modalButtonText}>Réessayer</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {game3 &&
                    (<Modal visible={game3} animationType="slide" transparent>
                        <View style={styles.modalContainerSuccess}>
                            <View style={styles.modalContentUpSuccess}>
                                <ImageBackground source={require('../assets/imgsAventure/modaleSimpleX.png')}
                                    resizeMode="stretch" style={styles.ImageModalContentSuccess}>
                                    <Text style={styles.modalTextSuccess}>{title}</Text>
                                </ImageBackground>
                            </View>
                            <View style={styles.modalContentDownSuccess}>
                                <TouchableOpacity onPress={finishGame} style={styles.modalButtonSuccess}>
                                    <ImageBackground source={require('../assets/imgsAventure/bbtnOffX.png')}
                                        resizeMode="stretch" style={styles.modalButtonSuccess}>
                                        <Text style={styles.modalButtonTextSuccess}>On passe à la suite !</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>)}
            </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    ImageBackground: {
        flex: 1,
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    titleContainer: {    //TITRE
        width: "100%",
        height: "50%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 14,
        fontFamily: "PressStart2P-Regular.ttf",
        color: "white",
        textAlign: "center",
        padding: 40,
        lineHeight: 28,
    },
    titleContainerImage: {
        width: 300,
        height: 300,
    },
    ImageTextHaut: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    gameOver: {
        backgroundColor: "#B71C1C",
    },
    score: {
        fontSize: 16,
        color: "white",
        marginTop: 5,
    },
    buttonContainerUp: {
        width: "100%",
        alignItems: "center",
        justifyContent: "spacebetween",
    },
    buttonContainer: {    //BOUTON
        width: "80%",
        height: "16%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        paddingVertical: 5,
    },
    metalButton: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    ImageButton: {
        width: "100%",
        height: "91%",
        alignItems: "center",
        justifyContent: "center",
    },

    textButton: {
        fontFamily: "PressStart2P-Regular.ttf",
        fontSize: 15,
        color: "white",
        textAlign: "center",
        width: "100%",
    },

    modalContainer: {    //MODAL SI PERDUE
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },

    modalContentUp: {
        width: 300,
        height: 300,
        aspectRatio: 1,  // Garde un format carré propre
        alignItems: "center",
        justifyContent: "center",
    },

    modalContentDown: {  // Corrigé ici (ancien doublon `modalContentUp`)
        width: "100%",
        height: "20%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    ImageModalContent: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    modalButton: {
        width: 300,  // Taille standard pour un bouton
        height: 80,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
    },
    modalText: {
        fontFamily: 'PressStart2P-Regular.ttf',
        fontSize: 18,
        color: "red",
        textAlign: "center",
        padding: 20,
        lineHeight: 40,
    },
    modalButtonText: {
        fontFamily: 'Goldman-Regular.ttf',
        fontSize: 30,
        color: "white",
        textAlign: "center",
    },

    modalContainerSuccess: {    //MODAL SI SUCCESS
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    modalContentUpSuccess: {
        width: 300,
        height: 300,
        alignItems: "center",
        justifyContent: "center",
    },

    modalContentDownSuccess: {
        width: "80%",
        height: "15%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
    },
    modalTextSuccess: {
        fontFamily: 'PressStart2P-Regular.ttf',
        fontSize: 20,
        color: "#72BF11",
        textAlign: "center",
        padding: 20,
        lineHeight: 35,
    },
    ImageModalContentSuccess: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    modalButtonSuccess: {
        width: 300,
        height: 80,
        alignItems: "center",
        justifyContent: "center",
    },
    modalButtonTextSuccess: {
        fontFamily: 'Goldman-Regular.ttf',
        fontSize: 25,
        color: "white",
        textAlign: "center",
        padding: 10,
    },
});
