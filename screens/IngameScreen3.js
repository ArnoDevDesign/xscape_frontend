import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, Animated, ImageBackground, Image } from "react-native";
import { addUserToStore } from "../reducers/users";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
const URL = process.env.EXPO_PUBLIC_BACKEND_URL;


export default function Ingame3Screen({ navigation }) {
    const isFocused = useIsFocused();
    const userRedux = useSelector((state) => state.users.value)
    const [title, setTitle] = useState("Activez les boutons dans le bon ordre  pour DEMINIATURISER LA CAPSULE!");
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
                setTitle("YES !!! Vous avez réussi à déminaturiser la capsule !");
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
                setScore(prevScore => prevScore - 250); // Décrémente le score
            } else {
                setTitle(` WOOOOOW ! tu as entendu ce bruit ??? c ets pas bon ca !!! Il reste ${newAttempts} essais.`);
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

    // -- JSX --//
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/imgsAventure/FondAventure01X.png')} style={styles.ImageBackground} />
            <View>
                <Animated.View style={[styles.titleContainer, gameOver ? styles.gameOver : shakeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["#37474F", "#B71C1C"]
                })]}>
                    <Image source={require('../assets/imgsAventure/modaleSimpleX.png')} />
                    <Text style={styles.title}>{title}</Text>
                    {/* <Text style={styles.score}>Score: {score}</Text> */}
                </Animated.View>
            </View>


            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={gameOver} onPress={() => handlePress(1)} style={styles.metalButton}>
                    <View style={styles.button}>
                        <Image source={require('../assets/imgsAventure/bbtnOffX.png')} style={styles.ImageButton} />
                        <Text style={styles.textButton}>{bouton1}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={gameOver} onPress={() => handlePress(1)} style={styles.metalButton}>
                    <View style={styles.button}>
                        <Image source={require('../assets/imgsAventure/bbtnOffX.png')} style={styles.ImageButton} />
                        <Text style={styles.textButton}>{bouton2}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={gameOver} onPress={() => handlePress(1)} style={styles.metalButton}>
                    <View style={styles.button}>
                        <Image source={require('../assets/imgsAventure/bbtnOffX.png')} style={styles.ImageButton} />
                        <Text style={styles.textButton}>{bouton3}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={gameOver} onPress={() => handlePress(1)} style={styles.metalButton}>
                    <View style={styles.button}>
                        <Image source={require('../assets/imgsAventure/bbtnOffX.png')} style={styles.ImageButton} />
                        <Text style={styles.textButton}>{bouton4}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Modal pour afficher un indice */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{indice1}</Text>
                        <TouchableOpacity onPress={resetGame} style={styles.modalButton}>
                            <Image source={require('../assets/imgsAventure/bbtnOffX.png')} />
                            <Text style={styles.modalButtonText}>Réessayer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {game3 && (<Modal visible={game3} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Image source={require('../assets/imgsAventure/modaleSimpleX.png')} />
                        <Text style={styles.modalText}>PAS MAL CAAAAAAA LAAAAAAAAA </Text>
                        <TouchableOpacity onPress={finishGame} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>FINI !!!!!!!!!!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>)}
        </View>
    );
}

// -- STYLES --//
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 10,
    },
    //TITRE
    titleContainer: {
        width: "100%",
        height: "25%",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",  // Définit une position relative pour les enfants
    },
    title: {
        fontSize: 25,
        fontFamily: 'Goldman-Regular.ttf',
        padding: 50,
        color: "white",
        position: "absolute",  // Superpose le texte à l’image
        top: "30%",            // Centre verticalement
        left: "10%",           // Centre horizontalement
        transform: [{ translateX: -50 }, { translateY: -50 }], // Ajuste le centrage
        textAlign: "center",
        width: "100%",
    },
    gameOver: {
        backgroundColor: "#B71C1C",
    },
    score: {
        fontSize: 16,
        color: "yellow",
        marginTop: 5,
    },
    //BOUTON
    buttonContainer: {
        width: "100%",
        height: "15%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    button: {
        position: "relative",  // Permet aux enfants d'être positionnés par rapport à ce conteneur
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    textButton: {
        fontFamily: 'Goldman-Bold.ttf',
        fontSize: 30,
        color: "green",
        position: "absolute",  // Superpose le texte à l’image
        top: "80%",            // Place au milieu verticalement
        left: "15%",           // Place au milieu horizontalement
        transform: [{ translateX: -50 }, { translateY: -50 }], // Centre parfaitement
        textAlign: "center",
        width: "100%",
    },

    // metalButton: {
    //     width: "70%",
    //     height: "100%",
    //     backgroundColor: "#607D8B",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     borderRadius: 10,
    //     borderWidth: 2,
    //     borderColor: "#B0BEC5",
    //     shadowColor: "#000",
    //     shadowOffset: { width: 2, height: 2 },
    //     shadowOpacity: 0.8,
    //     shadowRadius: 5,
    // },
    // metalButtonText: {
    //     fontSize: 16,
    //     fontWeight: "bold",
    //     color: "white",
    // },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContent: {
        width: "80%",
        // backgroundColor: "#37474F",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        color: "white",
        marginBottom: 15,
        textAlign: "center", // Centre le texte dans la modal
    },
    modalButton: {
        position: "relative",  // Permet aux enfants d'être positionnés par rapport à ce conteneur
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    modalButtonText: {
        fontFamily: 'Goldman-Bold.ttf',
        fontSize: 45,
        color: "white",
        position: "absolute",  // Superpose le texte à l’image
        top: "52%",            // Place au milieu verticalement
        left: "20%",           // Place au milieu horizontalement
        transform: [{ translateX: -50 }, { translateY: -50 }], // Centre parfaitement
        textAlign: "center",
        width: "100%",
    },
});
