import React, { useEffect, useState, useRef, } from "react";
import { StyleSheet, View, SafeAreaView, Button, TextInput, Text, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import { CameraView, CameraType, FlashMode } from 'expo-camera';
import _FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Video from 'expo-video';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

const URL = process.env.EXPO_PUBLIC_BACKEND_URL
const { checkBody } = require('../modules/checkBody');


export default function TestScreen() {

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

    const [modalout, setmodalout] = useState(false);
    const [modal2out, setmodal2out] = useState(false)

    const videoSource =
        video1 ? require('../assets/Video_1.mp4') :
            video2 ? require('../assets/Video_2.mp4') :
                video3 ? require('../assets/Video_3.mp4') :
                    video4 ? require('../assets/jojo.mp4') :
                        null;


    const player = useVideoPlayer(videoSource, (player) => {
        player.play(); // Lance la vidéo automatiquement
        player.loop = true; // Active la boucle
    });

    const [showInputs, setShowInputs] = useState(true);
    const [modalFinVisible, setModalFinVisible] = useState(false);

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });


    //////////// VALIDATION DU JEU 1 /////////////
    if (game1 === true) (
        Navigation.navigate('Ingame2Screen')
    )
    //////////////////////////////////////////////

    useEffect(() => {
        if (frequence1.length >= 6) {
            if (frequence1 !== '98.2') {
                setmodalout(true)

            }
        } else if (frequence1 === '100.3' || frequence1 === '94.4') {
            setmodal2out(true)

        }
    }, [frequence1]);
    useEffect(() => {
        if (frequence2.length >= 6 && !alertTriggered2) {
            if (frequence2 !== '94.4') {
                setmodalout(true)
            }
        } else if (frequence2 === '100.3' || frequence2 === '98.2') {
            setmodal2out(true)
        }
    }, [frequence2]);
    useEffect(() => {
        if (frequence3.length >= 6 && !alertTriggered3) {
            if (frequence3 !== '100.3') {
                setmodalout(true)
            }
        } else if (frequence3 === '98.2' || frequence3 === '94.4') {
            setmodal2out(true)
        }
    }, [frequence3]);
    // easteregg ////// il se declenche lorsce que l utilisateur a ecrit des mots speciaux au bon endroit /// 
    // cela affiche une modal qui fait apparaitre l oeuf avec animation et donne un enorme bonus de point ///
    // dans le profil il est detenteur DE L EASTER EGG JM // creation d nft
    function testInput1(value) {
        setFrequence1(value);
        if (value === '98.2') { // Vérifie la bonne fréquence avant de changer de vidéo
            setVideo1(false);
            setVideo2(true);
        }
    }

    function testInput2(value) {
        setFrequence2(value);
        if (value === '94.4' && video1 === false) { // Vérifie la bonne fréquence avant de changer de vidéo
            setVideo2(false);
            setVideo3(true);
        }
    }

    function testInput3(value) {
        setFrequence3(value);
        if (value === '100.3' && video2 === false) { // Vérifie la bonne fréquence avant de changer de vidéo
            setVideo3(false);
            setVideo4(true);
        }
    }

    useEffect(() => {
        if (frequence1 === '98.2' && frequence2 === '94.4' && frequence3 === '100.3') {
            setShowInputs(false); // Cache les inputs
            setModalFinVisible(true); // Affiche la modal
        }
    }, [frequence1, frequence2, frequence3]);






    useEffect(() => {
        fetch(`${URL}/etapesEpreuves/${userRedux.scenario}/${userRedux.username}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // console.log(data);
                // setTitle(data.name);
                // setDescription(data.descriptionScenario);
                // setdifficulte(data.difficulte)
                // setTheme(data.theme)
                // setDuree(data.duree);
                // console.log(data.difficulte)
                // console.log(data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [userRedux])











    // style={{...styles.input1, backgroundColor: Boolean(frequence1) ? 'green' : 'red'}
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
                            <View style={{ ...styles.input1, backgroundColor: frequence1 === '98.2' ? 'green' : '#1b3815' }}>
                                <Text style={styles.text1}>HEY PAPA</Text>
                                <TextInput placeholderTextColor={'#8aec54'} style={styles.inp1} placeholder="Frequence 1 ..." onChangeText={(value) => testInput1(value)} value={frequence1} />
                            </View>
                            <View style={{ ...styles.input2, backgroundColor: frequence2 === '94.4' ? 'green' : '#1b3815' }}>
                                <Text style={styles.text1}>HEY PAPI</Text>
                                <TextInput placeholderTextColor={'#8aec54'} placeholder="Frequence 2 ..." onChangeText={(value) => testInput2(value)} value={frequence2} />
                            </View>
                            <View style={{ ...styles.input3, backgroundColor: frequence3 === '100.3' ? 'green' : '#1b3815' }}>
                                <Text style={styles.text1}>HEY PAPO</Text>
                                <TextInput placeholderTextColor={'#8aec54'} placeholder="Frequence 3 ..." onChangeText={(value) => testInput3(value)} value={frequence3} />
                            </View>
                        </View>
                    )}

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
                    )}
                    {modalFinVisible && (
                        <Modal visible={modalFinVisible} animationType="fade" transparent>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <ImageBackground source={require('../assets/modalEcran.png')} style={styles.imageBackground}>
                                        <TouchableOpacity onPress={() => {
                                            setModalFinVisible(false);
                                            setGame1(true);
                                        }} style={styles.button}>
                                            <Text style={styles.textButton}>{/*etape 1reussi*/}</Text>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                </View>
                            </View>
                        </Modal>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    //css VIDEO
    contentContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
    },
    video: {
        width: 350,
        height: 275,
    },
    controlsContainer: {
        padding: 10,
    },
    //css
    textButton: {//commentaire
        fontSize: 20,
        fontWeight: 300,

    },
    button: {
        width: '70%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    //modal css
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
        height: 100,
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
    input2: {
        width: "80%",
        height: 100,
        backgroundColor: '#1b3815',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 4,
    },
    input3: {
        width: "80%",
        height: 100,
        backgroundColor: '#1b3815',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 4,
    },
    text1: {
        color: '#8aec54'
    },
    inp1: {
        color: '#8aec54',
        fontSize: 15
    }
})
