import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, Modal, TextInput, FlatList, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToStore, userLogout } from '../reducers/users'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
const URL = process.env.EXPO_PUBLIC_BACKEND_URL
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get("window");


export default function ProfileScreen({ navigation }) {

    const [loaded] = useFonts({
        "Fustat-Bold.ttf": require("../assets/fonts/Fustat-Bold.ttf"),
        "Fustat-ExtraBold.ttf": require("../assets/fonts/Fustat-ExtraBold.ttf"),
        "Fustat-ExtraLight.ttf": require("../assets/fonts/Fustat-ExtraLight.ttf"),
        "Fustat-Light.ttf": require("../assets/fonts/Fustat-Light.ttf"),
        "Fustat-Medium.ttf": require("../assets/fonts/Fustat-Medium.ttf"),
        "Fustat-Regular.ttf": require("../assets/fonts/Fustat-Regular.ttf"),
        "Fustat-SemiBold.ttf": require("../assets/fonts/Fustat-SemiBold.ttf"),
        "Homenaje-Regular.ttf": require("../assets/fonts/Homenaje-Regular.ttf"),
        "PressStart2P-Regular.ttf": require("../assets/fonts/PressStart2P-Regular.ttf"),
    });

    useEffect(() => {
        // cacher l'écran de démarrage si la police est chargée ou s'il y a une erreur
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    // Retourner null tant que la police n'est pas chargée
    if (!loaded) {
        return null;
    }

    const dispatch = useDispatch();
    const userRedux = useSelector((state) => state.users.value)
    const isFocused = useIsFocused();
    // États pour infos utilisateur
    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [score, setScore] = useState('');

    const [modalUserVisible, setUserModalVisible] = useState(false);
    const [modalAvatarVisible, setAvatarModalVisible] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [finishedScenario, setFinishedScenarios] = useState(0);
    const [modalaventures, setModalaventures] = useState(false);


    // Images d'avatarts pour test
    const images = [
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar01_zdi0zf.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar02_zrsv6f.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar03_nyapav.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar04_tka0gd.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar05_fui9wm.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar06_jrvz5x.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar07_qr2sxd.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar08_cd4udv.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105221/avatar09_bkdrx9.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105221/avatar10_nh5quw.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105222/avatar11_llbefo.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105222/avatar12_b24cyi.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741475164/avatar14_tkkoyp.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741475165/avatar13_ncoafc.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741475165/avatar16_hjdm7r.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741475164/avatar15_czilrr.png',
        'https://res.cloudinary.com/dpyozodnm/image/upload/v1741475164/avatar17_ksdjdu.png',
        // require('../assets/avatar01.png'),
        // require('../assets/avatar02.png'),
        // require('../assets/avatar03.png'),
        // require('../assets/avatar04.png'),
    ];
    // Récupération des données utilisateur au chargement du composant
    useEffect(() => {
        if (!userRedux.token) {
            console.log("ProfilesScren : Aucun token trouvé !");
            return;
        }
        console.log("ProfilesScren : Token utilisé :", userRedux.token);
        fetch(`${URL}/users/${userRedux.token}`)
            .then(response => response.json())
            .then(data => {
                console.log('Données utilisateur récupérées sur paage de profil :', data);
                setEmail(data.email);
                setScore(data.totalPoints);
                setFinishedScenarios(data.scenarios);
            })
            .catch(error => console.error('ProfilesScren : Erreur de récupération des données:', error));
    }, [userRedux.token, isFocused]);


    //Fonction de déconnexion 
    const handleLogout = () => {
        fetch(`${URL}/users/deleteToken`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: userRedux.token })
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                dispatch(userLogout());
                navigation.navigate('Home');
            }
            ).catch(error => console.error('❌ Erreur de déconnexion:', error));
    }

    //Modification du username et token au clic 
    const updateUsername = () => {
        if (!newUsername.trim()) {
            alert("Le pseudo ne peut pas être vide !");
            return;
        }

        // Crée un objet à envoyer
        let updateData = { token: userRedux.token };
        if (newUsername) updateData.username = newUsername;
        if (selectedAvatar) updateData.avatar = selectedAvatar; // ✅ Ne pas écraser l'ancien avatar

        fetch(`${URL}/users/updateProfil`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setUsername(newUsername);
                    dispatch(addUserToStore({ username: newUsername, avatar: userRedux.avatar }));
                    setUserModalVisible(false);
                    console.log("✅ Username mis à jour !");
                    alert('Pseudo mis à jour');
                } else {
                    console.log('❌ Erreur mise à jour username', data.error);
                    alert('Erreur mise à jour pseudo');
                }
            })
            .catch(error => {
                console.error('❌ Erreur de mise à jour username:', error);
                alert("Erreur de connexion au serveur");
            });
    };

    function changeAvatar(item) {
        setSelectedAvatar(item);

        // Met à jour Redux immédiatement
        dispatch(addUserToStore({ avatar: item }));

        // Envoie la mise à jour à la base de données
        fetch(`${URL}/users/updateProfil`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: userRedux.token, avatar: item })
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    console.log("✅ Avatar mis à jour avec succès !");
                    setAvatarModalVisible(false);
                } else {
                    console.log("❌ Erreur mise à jour avatar", data.error);
                    alert("Erreur mise à jour avatar");
                }
            })
            .catch(error => {
                console.error('❌ Erreur de mise à jour avatar:', error);
                alert("Erreur de connexion au serveur");
            });
    }



    return (
        <View style={styles.generalContainer}>
            {/* bouton déconnexion */}

            <View style={styles.containerButtonLogOut}>
                <TouchableOpacity style={styles.buttonLogOut}>
                    <FontAwesome name='sign-out' size={30} color='#85CAE4' borderRadius='100' />
                </TouchableOpacity>
            </View>
            <View backgroundColor='#85CAE4' height='200' width='100%' />

            {/* Avatar */}
            <View style={styles.avatarContainerMain}>
                <TouchableOpacity onPress={() => setAvatarModalVisible(true)}  >
                    <Image source={{ uri: userRedux.avatar }} style={styles.avatar} />
                </TouchableOpacity>
            </View>

            {/* Modal Modification de l'avatar */}
            {modalAvatarVisible && (
                <Modal visible={modalAvatarVisible} transparent animationType="slide">
                    <View style={styles.centeredViewAvatar}>
                        <View style={styles.modalViewAvatar}>
                            <Text style={styles.textChangeUsernameView}>Choisis ton avatar</Text>
                            {/* Carousel d'avatars */}
                            <FlatList
                                data={images}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.carousel}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => changeAvatar(item)}>
                                        <Image
                                            source={{ uri: item }}
                                            style={[
                                                styles.image,
                                                selectedAvatar === item && styles.selectedImage
                                            ]}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setAvatarModalVisible(false)} style={styles.usernameView}>
                                <Text style={styles.closeModalTextButton}>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Infos utilisateur */}
            <View style={styles.usernameView}>
                <Text style={styles.textUsernameView}>{userRedux.username}</Text>
                <TouchableOpacity onPress={() => setUserModalVisible(true)} style={styles.iconEdit2} >
                    <FontAwesome name='pencil' size={24} color="#85CAE4" />
                </TouchableOpacity>
                <Text style={styles.textEmailUsernameView}>{email}</Text>
            </View>

            {/* Modal Modification de l'username */}
            {modalUserVisible && (
                <Modal visible={modalUserVisible} animationType="fade" transparent>
                    <View style={styles.centeredViewUser}>
                        <View style={styles.modalViewUser}>
                            <Text style={{ fontFamily: "Fustat-Bold.ttf", fontSize: 30, color: '#009EBA' }}>Choisissez un</Text>
                            <Text style={{ fontFamily: "Fustat-Bold.ttf", fontSize: 30, color: '#009EBA', paddingBottom: 40 }}>nouveau pseudo</Text>

                            <TextInput
                                placeholderTextColor={'black'}
                                style={styles.inp1}
                                placeholder="Nouveau pseudo"
                                onChangeText={setNewUsername}
                                value={newUsername}
                            />
                            <TouchableOpacity onPress={() => updateUsername()} activeOpacity={0.8} style={styles.changeUsernameButton}>
                                <Text style={styles.textChangeUsernameButton}>Changer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setUserModalVisible(false)} activeOpacity={0.8}>
                                <Text style={styles.closeTextButton}>Annuler</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            {/* Infos Score */}
            <View style={styles.scoreView}>
                <Text style={styles.scoretxt}>Score :</Text>
                <Text style={styles.scorePoint}>{score} </Text>
                <Text style={[styles.pointTxt]}>points</Text>
            </View>

            {/* Infos scenarios */}
            <View style={styles.aventureView}>
                {finishedScenario ? (
                    <View>
                        <Text style={styles.textButtonFinishedAdventure}>Aventures terminées</Text>
                        <Text style={styles.textButton}>{finishedScenario}</Text>
                        {/* <TouchableOpacity onPress={() => setModalaventures(true)} style={styles.buttonFinishedAdventure}> */}

                    </View>
                ) :
                    (<Text>Aucune aventure terminée...pour le moment ! </Text>
                    )}
            </View>

            {/* Boutons */}
            <View style={styles.mapIconView}>
                <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                    <FontAwesome name='map-o' size={32} color="white" justifyContent='center' alignItems='center' />
                </TouchableOpacity>
            </View>
            {/* <Button title="Go to Home" onPress={() => navigation.navigate('StartGame')} /> */}
        </View>
    );
}

// -- CSS STYLE --
const styles = StyleSheet.create({

    generalContainer: {
        flex: 1,
        // justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 20,
        backgroundColor: 'white',
        position: 'relative',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '80%',
        height: '50%',
        borderRadius: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
    },
    // Icon style
    iconEdit1: {
        position: "absolute",
        top: 170,
        right: 5,
        opacity: 0.8,
        boderRadius: 10,
        padding: 5,
    },
    iconEdit2: {
        position: "absolute",
        bottom: 70,
        right: 70,
        // backgroundColor: 'white',
        opacity: 0.8,
        boderRadius: 10,
        padding: 5,
    },
    avatarContainerMain: {
        marginTop: -140,
        // backgroundColor: "blue",
    },

    avatar: {
        width: width * 0.5, // Taille des avatars ajustée
        height: width * 0.5,
        borderRadius: 100, // Correcte au lieu de "50%"
        marginHorizontal: 30,
        elevation: 3
    },
    //Modal Avatar Style

    centeredViewAvatar: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#85CAE4', // Semi-transparent background
    },
    modalViewAvatar: {
        backgroundColor: '#003046',
        borderRadius: 20,
        padding: 20,
        paddingHorizontal: -20,
        alignItems: 'center',
        height: '60%',
        width: '80%',

    },
    modalViewUser: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        paddingTop: 30,
        paddingBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        elevation: 3,
    },
    image: {
        width: width * 0.5, // Taille des avatars ajustée
        height: width * 0.5,
        borderRadius: 100, // Correcte au lieu de "50%"
        marginHorizontal: 30,
        elevation: 3
    },

    selectedImage: {
        borderWidth: 2,
        borderColor: 'white',
    },
    // Username style
    usernameView: {
        alignItems: 'center',
        width: '100%',
        height: 100,
        top: 14,
    },

    textUsernameView: {
        fontSize: 28,
        fontFamily: "Fustat-ExtraBold.ttf",
        justifyContent: 'center',
        color: "#003046",
    },

    textEmailUsernameView: {
        fontSize: 18,
        fontFamily: "Fustat-Regular.ttf",
        justifyContent: 'center',
        color: "#FF8527",
        bottom: 14,
    },

    closeModalTextButton: {
        fontSize: 32,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "#85CAE4",
        padding: 5,
    },

    textChangeUsernameView: {
        fontSize: 32,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "#85CAE4",
        paddingBottom: 50,
    },

    //Modal Username Style
    centeredViewUser: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    inp1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        height: 70,
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        margin: 12,
        paddingLeft: 20
    },
    textButton: {
        fontSize: 20,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "#FF8527",
        padding: 10,
    },
    changeUsernameButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 72,
        backgroundColor: '#FF8527',
        margin: 20,
        marginTop: 50,
        borderRadius: 20,
        elevation: 3,
    },
    textChangeUsernameButton: {
        fontSize: 20,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        justifyContent: 'center',
        color: "white",
        padding: 10,
    },

    closeTextButton: {
        fontSize: 20,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "#85CAE4",
        padding: 10,
    },

    scoreView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "90%",
        height: "25%",
        paddingTop: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#B3B4BA',
        // backgroundColor: "black",
    },

    scoretxt: {
        fontSize: 18,
        fontFamily: "Fustat-Regular.ttf",
        justifyContent: 'center',
        alignItems: 'center',
        color: "#636773",
    },

    scorePoint: {
        fontSize: 80,
        fontFamily: "Fustat-ExtraBold.ttf",
        justifyContent: 'center',
        alignItems: 'center',
        color: "#FF8527",
        // backgroundColor: 'red',
        height: '60%',
        marginBottom: -20,
    },

    pointTxt: {
        fontSize: 32,
        fontFamily: "Fustat-ExtraBold.ttf",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        color: "#FF8527",
        // backgroundColor: 'blue',
    },


    //Scenario Style


    containerButtonLogOut: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        paddingHorizontal: '20',
        position: 'absolute',
        top: 55,
        right: 5,
        zIndex: 3,
    },
    buttonLogOut: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        backgroundColor: 'white',
        borderRadius: 100,
        elevation: 3,
        paddingLeft: 5,
    },
    textButtonLogOut: {
        fontSize: 20,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "white",
        padding: 10,
    },
    aventureView: {
        width: '80%',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        marginTop: 42,
        // backgroundColor: "blue",
    },
    buttonFinishedAdventure: {
        width: 300,
        // backgroundColor: '#FF8527',
        padding: 10,
        borderRadius: 80,
        alignItems: 'center',
    },

    textButtonFinishedAdventure: {
        fontSize: 20,
        fontFamily: "Fustat-Regular.ttf",
        alignItems: 'center',
        color: "#636773",
    },
    selectedImage: {
        borderWidth: 5,
        borderColor: "White",
    },
    mapIconView: {
        backgroundColor: '#FF8527',
        borderRadius: 100,
        padding: 18,
        margin: 40,

    },
});