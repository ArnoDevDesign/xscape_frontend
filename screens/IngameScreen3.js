import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, Animated } from "react-native";

export default function Ingame3Screen() {
    const [title, setTitle] = useState("Activez les boutons dans le bon ordre !");
    const [pressedOrder, setPressedOrder] = useState([]);
    const [attempts, setAttempts] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [score, setScore] = useState(500);

    // Animation
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // Ordre correct des boutons
    const correctSequence = [1, 3, 4, 2];

    function handlePress(buttonNumber) {
        if (gameOver) return; // Empêcher les clics après un échec

        const newOrder = [...pressedOrder, buttonNumber];

        if (newOrder.every((num, index) => num === correctSequence[index])) {
            setPressedOrder(newOrder);

            if (newOrder.length === correctSequence.length) {
                setTitle("✔️ Succès ! Séquence validée.");
            }
        } else {
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);

            // Déclenche l'animation de clignotement
            triggerShake();

            if (newAttempts === 0) {
                setTitle("❌ Échec ! Vous avez besoin d'un indice.");
                setGameOver(true);
                setModalVisible(true);
                setScore(prevScore => Math.max(0, prevScore - 250)); // Décrémente le score
            } else {
                setTitle(`⚠️ Mauvaise séquence ! Il reste ${newAttempts} essais.`);
                setPressedOrder([]);
            }
        }
    }

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
        setTitle("🔄 Essayez à nouveau !");
        setAttempts(3);
        setGameOver(false);
        setPressedOrder([]);
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.titleContainer, gameOver ? styles.gameOver : shakeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["#37474F", "#B71C1C"]
            })]}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.score}>Score: {score}</Text>
            </Animated.View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={gameOver} onPress={() => handlePress(1)} style={styles.metalButton}>
                    <Text style={styles.metalButtonText}>Bouton 1</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={gameOver} onPress={() => handlePress(2)} style={styles.metalButton}>
                    <Text style={styles.metalButtonText}>Bouton 2</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={gameOver} onPress={() => handlePress(3)} style={styles.metalButton}>
                    <Text style={styles.metalButtonText}>Bouton 3</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={gameOver} onPress={() => handlePress(4)} style={styles.metalButton}>
                    <Text style={styles.metalButtonText}>Bouton 4</Text>
                </TouchableOpacity>
            </View>

            {/* Modal pour afficher un indice */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>💡 Indice : Essayez une séquence plus logique !</Text>
                        <TouchableOpacity onPress={resetGame} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Réessayer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 10,
    },
    titleContainer: {
        width: "100%",
        height: "15%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#37474F",
        borderRadius: 10,
        marginBottom: 20,
    },
    gameOver: {
        backgroundColor: "#B71C1C",
    },
    title: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
    },
    score: {
        fontSize: 16,
        color: "yellow",
        marginTop: 5,
    },
    buttonContainer: {
        width: "100%",
        height: "15%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
    },
    metalButton: {
        width: "70%",
        height: "100%",
        backgroundColor: "#607D8B",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#B0BEC5",
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    metalButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#37474F",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        color: "white",
        marginBottom: 15,
        textAlign: "center",
    },
    modalButton: {
        backgroundColor: "#FF6F00",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    }, r
});
