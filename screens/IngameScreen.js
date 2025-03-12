import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, View, SafeAreaView, Button, TextInput, Text, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { CameraView, CameraType, FlashMode } from 'expo-camera';
import _FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Video from 'expo-video';

import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';


const URL = process.env.EXPO_PUBLIC_BACKEND_URL

export default function IngameScreen1({ navigation }) {

    const isFocused = useIsFocused();
    const userRedux = useSelector((state) => state.users.value)
    const [video1, setVideo1] = useState(true);
    const [video2, setVideo2] = useState(false);
    const [video3, setVideo3] = useState(false);
    const [video4, setVideo4] = useState(false);
    const dispatch = useDispatch();
    const [JoVideo, setJoVideo] = useState(false);
    const [frequence1, setFrequence1] = useState('');
    const [frequence2, setFrequence2] = useState('');
    const [frequence3, setFrequence3] = useState('');
    const [game1, setGame1] = useState(false);
    const [indice1, setIndice1] = useState('');
    const [indice2, setIndice2] = useState('');
    const [indice3, setIndice3] = useState('');
    const [goodFrequence1, setGoodFrequence1] = useState('')
    const [goodFrequence2, setGoodFrequence2] = useState('')
    const [goodFrequence3, setGoodFrequence3] = useState('')
    const [indiceused1, setIndiceused1] = useState(false)
    const [indiceused2, setIndiceused2] = useState(false)
    const [indiceused3, setIndiceused3] = useState(false)
    const [showInputs, setShowInputs] = useState(true);
    const [modalFinVisible, setModalFinVisible] = useState(false);
    const [modalout, setmodalout] = useState(false);
    const [modal2out, setmodal2out] = useState(false)
    const [indicemodal1, setIndicemodal1] = useState(false)
    const [indicemodal2, setIndicemodal2] = useState(false)
    const [indicemodal3, setIndicemodal3] = useState(false)
    const [showfinalbutton, setShowfinalbutton] = useState(false)
    const { lastvideo, setLastvideo } = useState(false)
    const [SCORE, setSCORE] = useState(500)

    const [lightColor, setLightColor] = useState("yellow");


    const videoSource =
        video1 ? require('../assets/Video_1.mp4') :
            video2 ? require('../assets/Video_2.mp4') :
                video3 ? require('../assets/Video_3.mp4') :
                    video4 ? require('../assets/jojo.mp4') :
                        null

    const player = useVideoPlayer(videoSource, (player) => {
        player.play();
        if (isFocused) { player.loop = false } else { player.loop = true };
    });


    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    useEffect(() => {
        if (frequence1.length >= goodFrequence1.length) {
            if (frequence1 === goodFrequence1) {
                setLightColor("green")
            } else {
                setLightColor("red")
                setmodalout(true);
            }
        }
    }, [frequence1]);

    useEffect(() => {
        if (frequence2.length >= goodFrequence2.length) {
            if (frequence2 === goodFrequence2) {
                setLightColor("green")
            } else {
                setLightColor("red")
                setmodalout(true);
            }
        }
    }, [frequence2]);

    useEffect(() => {
        if (frequence3.length >= goodFrequence3.length) {
            if (frequence3 === goodFrequence3) {
                setLightColor("green")
            } else {
                setLightColor("red")
                setmodalout(true);
            }
        }
    }, [frequence3]);


    useEffect(() => {
        fetch(`${URL}/scenarios/etapes/${userRedux.scenarioID}/${userRedux.userID}`)
            .then(response => response.json())
            .then(data => {
                console.log("retour fetch ", data);
                if (data.expectedAnswer1 !== goodFrequence1) setGoodFrequence1(data.expectedAnswer1);
                if (data.expectedAnswer2 !== goodFrequence2) setGoodFrequence2(data.expectedAnswer2);
                if (data.expectedAnswer3 !== goodFrequence3) setGoodFrequence3(data.expectedAnswer3);
                if (data.indice1 !== indice1) setIndice1(data.indice1);
                if (data.indice2 !== indice2) setIndice2(data.indice2);
                if (data.indice3 !== indice3) setIndice3(data.indice3);
                setSCORE(data.score);
            })
            .catch((error) => {
                console.error('Error:', error.message);
            });
    }, [userRedux.userID, userRedux.scenarioID, isFocused])



    function testInput1(value) {
        setFrequence1(value);
        if (value === goodFrequence1) {
            setVideo1(false);
            setVideo2(true);
        }
    }

    function testInput2(value) {
        setFrequence2(value);
        if (value === goodFrequence2 && video1 === false) {
            setVideo2(false);
            setVideo3(true);
        }
    }

    function testInput3(value) {
        setFrequence3(value);
        if (value === goodFrequence3 && video2 === false) {
            setVideo3(false);
            setVideo4(true);
        }
    }
    useEffect(() => {
        if (
            frequence1.length >= 2 &&
            frequence2.length >= 2 &&
            frequence3.length >= 2 &&
            frequence1 === goodFrequence1 &&
            frequence2 === goodFrequence2 &&
            frequence3 === goodFrequence3 &&
            showInputs
        ) {
            setShowInputs(false);
            setJoVideo(false);
            setShowfinalbutton(true)
        }
    }, [frequence3])

    const penaliserScore = () => {
        setSCORE(prevScore => {
            const newScore = prevScore - 100;
            console.log("Pénalité appliquée, nouveau score :", newScore);
            return newScore;
        });

        setTimeout(() => {
            console.log("Score après mise à jour réelle :", SCORE);
        }, 100);
    };



    const finalButton = () => {
        setGame1(true);

        setTimeout(() => {
            console.log("Score final envoyé au backend :", SCORE);

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
                    setJoVideo(false);
                    navigation.replace("Ingame2");
                })
                .catch(error => {
                    console.error('Erreur lors de la requête:', error);
                });
        }, 200);
    };






    return (
        <View style={styles.container}>
            <SafeAreaView />

            {game1 === false && (
                <View style={styles.container}>
                    <View style={styles.videoContainer}>
                        <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
                        <View style={styles.controlsContainer}>
                            <Button
                                title={isPlaying ? 'Pause' : 'Play'}
                                onPress={() => {
                                    if (isPlaying) {
                                        player.pause();
                                    } else {
                                        player.play();
                                    }
                                }}
                            />
                        </View>
                    </View>
                    {showInputs && (
                        <View style={styles.inputContainer}>
                            <View style={[styles.light, { backgroundColor: frequence1 === goodFrequence1 ? "green" : frequence1 ? "red" : "white" }]} >
                                <TextInput
                                    placeholderTextColor={'#8aec54'}
                                    style={styles.inp1}
                                    placeholder="Entrez la 1ère Fréquence"
                                    onChangeText={(value) => testInput1(value)}
                                    value={frequence1}
                                />
                            </View>
                            <Button title={'Indice'} style={styles.indicebutton} onPress={() => setIndicemodal1(true)} />
                            <View style={[styles.light, { backgroundColor: frequence2 === goodFrequence2 ? "green" : frequence2 ? "red" : "white" }]} >
                                <TextInput
                                    placeholderTextColor={'#8aec54'}
                                    style={styles.inp1}
                                    placeholder="Entrez la Fréquence 2.0"
                                    onChangeText={(value) => testInput2(value)}
                                    value={frequence2}
                                />

                            </View>
                            <Button title={'Indice'} style={styles.indicebutton} onPress={() => setIndicemodal2(true)} />
                            <View style={[styles.light, { backgroundColor: frequence3 === goodFrequence3 ? "green" : frequence3 ? "red" : "white" }]} >
                                <TextInput
                                    placeholderTextColor={'#8aec54'}
                                    style={styles.inp1}
                                    placeholder="Entrez la 3emeFréquence"
                                    onChangeText={(value) => testInput3(value)}
                                    value={frequence3}
                                />
                            </View>
                            <Button title={'Indice'} style={styles.indicebutton} onPress={() => setIndicemodal3(true)} />
                        </View>
                    )}
                    {showfinalbutton && (
                        <View style={styles.inputContainer}>
                            <TouchableOpacity onPress={() => finalButton()} style={styles.buttonfin}>
                                <Text style={styles.textButton}>Declencher le scanner QRCODIQUE</Text>
                            </TouchableOpacity>
                        </View>)}
                    {modalout && (
                        <Modal visible={modalout} animationType="fade" transparent>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <ImageBackground source={require('../assets/modalEcran.png')} style={styles.imageBackground}>
                                        <TouchableOpacity onPress={() => setmodalout(false)} style={styles.button}>
                                            <Text style={styles.textButton}>Mauvaise fréquence</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                            </View>
                        </Modal>
                    )}
                    {modal2out && (
                        <Modal visible={modal2out} animationType="fade" transparent>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <ImageBackground source={require('../assets/modalEcran.png')} style={styles.imageBackground}>
                                        <TouchableOpacity onPress={() => setmodal2out(false)} style={styles.button}>
                                            <Text style={styles.textButton}>Bon code, mauvais endroit...</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                            </View>
                        </Modal>
                    )} {indicemodal1 && (
                        <Modal visible={indicemodal1} animationType="fade" transparent>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <ImageBackground source={require('../assets/modalEcran.png')} style={styles.imageBackground}>
                                        <TouchableOpacity onPress={() => { setIndicemodal1(false); penaliserScore() }} style={styles.button}>
                                            <Text style={styles.textButton}>{indice1}</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                            </View>
                        </Modal>
                    )}{indicemodal2 && (
                        <Modal visible={indicemodal2} animationType="fade" transparent>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <ImageBackground source={require('../assets/modalEcran.png')} style={styles.imageBackground}>
                                        <TouchableOpacity onPress={() => { setIndicemodal2(false); penaliserScore() }} style={styles.button}>
                                            <Text style={styles.textButton}>{indice2}</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                            </View>
                        </Modal>
                    )}{indicemodal3 && (
                        <Modal visible={indicemodal3} animationType="fade" transparent>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <ImageBackground source={require('../assets/modalEcran.png')} style={styles.imageBackground}>
                                        <TouchableOpacity onPress={() => { setIndicemodal3(false); penaliserScore() }} style={styles.button}>
                                            <Text style={styles.textButton}>{indice3}</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                            </View>
                        </Modal>
                    )}
                </View>
            )
            }
        </View>
    );
}


const styles = StyleSheet.create({
    light: {
        width: '80%',
        height: 80,

        borderWidth: 3,
        borderColor: 'white',
        shadowColor: 'rgba(255, 255, 255, 0.8)',
        shadowOpacity: 1,
        shadowRadius: 30,

        alignItems: 'center',
        justifyContent: 'center',
    },

    contentContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
    },
    buttonfin: {
        width: '70%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue'
    },
    video: {
        width: 350,
        height: 275,
    },

    indicebutton: {
        backgroundColor: 'white',
        borderRadius: "50%",
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsContainer: {
        padding: 10,
    },
    //css
    textButton: {
        fontSize: 20,
        fontWeight: 300,

    },
    button: {
        width: '70%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    imageBackground: {
        flex: 1,
        width: '100%',
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal1: {
        flex: 1,
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'green'
    },
    videoContainer: {
        flex: 2,
        backgroundColor: 'grey'
    },
    inputContainer: {
        flex: 2,
        width: '100%',
        backgroundColor: 'grey',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,

    },
    input1: {
        width: "80%",
        height: '20%',
        backgroundColor: '#1b3815',
        borderColor: 'black',
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
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
    input2: {
        width: "80%",
        height: '20%',
        backgroundColor: '#1b3815',
        borderColor: 'black',
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input3: {
        width: "80%",
        height: '20%',
        backgroundColor: '#1b3815',
        borderColor: 'black',
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text1: {
        color: '#8aec54'
    },
    inp1: {
        color: '#8aec54',
        fontSize: 15
    }
})
