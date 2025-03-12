import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, Modal, TextInput, FlatList, Dimensions } from 'react-native';
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
        fetch(`${URL}/users/deleteToken}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: userRedux.token })
        }).then(response => response.json())
            .then(data => {
                dispatch(userLogout());
                navigation.navigate('Home');
                console.log('Déconnexion', data);
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

    // console.log("Selected Avatar:", selectedAvatar);
    // console.log("Avatar affiché:", userRedux.avatar);
    // console.log("Liste d'images disponibles:", images);

    return (
        <View style={styles.generalContainer}>
            <SafeAreaView />
            {/* bouton déconnexion */}
            <View style={styles.buttonLogOut}>
                <TouchableOpacity>
                    <FontAwesome name='sign-out' size={30} color='#85CAE4' borderRadius='100' />
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainerMain}>
                <Image source={{ uri: userRedux.avatar }} style={styles.avatar} />

                {/* <Image source={avatar ? { uri: avatar } : require('../assets/Avatar_jojo.png')} style={styles.avatar} /> */}
                <TouchableOpacity onPress={() => setAvatarModalVisible(true)} style={styles.iconEdit1} >
                    <FontAwesome name='pencil' size={24} color='black' paddingTop={38} />
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
                <Text style={styles.textUsernameView}>Username : {userRedux.username}</Text>

                <TouchableOpacity onPress={() => setUserModalVisible(true)} style={styles.iconEdit2} >
                    <FontAwesome name='pencil' size={20} color="black" style={styles.updateUser} />
                </TouchableOpacity>
                <Text style={styles.textUsernameView}>Email : {email}</Text>
            </View>

            {/* Modal Modification de l'username */}
            {modalUserVisible && (
                <Modal visible={modalUserVisible} animationType="fade" transparent>
                    <View style={styles.centeredViewUser}>
                        <View style={styles.modalViewUser}>
                            <Text style={{ fontFamily: "Fustat-SemiBold.ttf", fontSize: 30, color: '#009EBA' }}>Choisissez un</Text>
                            <Text style={{ fontFamily: "Fustat-SemiBold.ttf", fontSize: 30, color: '#009EBA', paddingBottom: 40 }}>nouveau pseudo</Text>

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
            <Text style={[styles.text, styles.score]}>Score : {score}</Text>

            {/* Infos scenarios */}
            <View style={styles.aventureView}>
                {finishedScenario ? (
                    <View>
                        <TouchableOpacity onPress={() => setModalaventures(true)} style={styles.buttonFinishedAdventure}>
                            <Text style={styles.textButtonFinishedAdventure}>Aventures terminées : </Text>
                        </TouchableOpacity>
                        {modalaventures && (
                            <Modal visible={modalaventures} animationType="slide" transparent>
                                <View style={styles.centeredView}>
                                    <TouchableOpacity onPress={() => setModalaventures(false)}>
                                        <View style={styles.modalViewUser}>
                                            <Text style={styles.textButton}>{finishedScenario}</Text>
                                            <Text style={styles.textButton}>{finishedScenario}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal>)}
                    </View>




                ) :
                    (<Text style={styles.text}>Aucune aventure terminée...pour le moment ! </Text>
                    )}
            </View>

            {/* Boutons */}
            <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.buttonBack}>
                <Text style={styles.text}>Retour MAP</Text>
            </TouchableOpacity>

            {/* <Button title="Go to Home" onPress={() => navigation.navigate('Home')} /> */}

        </View>
    );
}

// -- CSS STYLE --
const styles = StyleSheet.create({

    generalContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
        backgroundColor: '#85CAE4'
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
        top: 5,
        right: 5,
        // backgroundColor: 'white',
        opacity: 0.8,
        boderRadius: 10,
        padding: 5,
    },
    iconEdit2: {
        position: "absolute",
        bottom: 100,
        right: -24,
        // backgroundColor: 'white',
        opacity: 0.8,
        boderRadius: 10,
        padding: 5,
    },
    // Avatar style
    avatarContainerMain: {
        width: '50%',
        height: '25%',
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,

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

    buttonBack: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 10,
    },
    text: {
        color: 'white',
        fontSize: 16,
    },

    // Username style
    usernameView: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        columnGap: "10",
        width: '80%',
        height: 72,
        backgroundColor: '#85CAE4',
        margin: 20,
        borderRadius: 20,
        // elevation: 3,
    },
    textUsernameView: {
        fontSize: 32,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "#003046",

        // padding: 5,
    },
    closeModalTextButton: {
        fontSize: 32,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "#003046",
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
        alignContent: 'flex-end',
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
    // Score Style
    score: {
        fontSize: 32,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        color: "#FFFFFF",
    },
    //Scenario Style
    aventureView: {
        backgroundColor: 'white',
        // opacity: 0.5,
        padding: 10,
        width: '80%',
        alignItems: 'center',
        borderRadius: 20,
    },

    //Bouton Style
    buttonLogOut: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '15%',
        height: 60,
        backgroundColor: '#636773',
        // margin: 20,
        opacity: 0.5,
        borderRadius: 100,
        elevation: 3,
        left: 330,
        paddingLeft: 5,
        bottom: 740,
        zIndex: 10,
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

    buttonFinishedAdventure: {
        padding: 15,
        // backgroundColor: 'red',
        // opacity: 0.5,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },

    textButtonFinishedAdventure: {
        fontSize: 20,
        fontFamily: "Fustat-ExtraBold.ttf",
        alignItems: 'center',
        color: "#FF8527",
    },
    text: {
        color: 'black',
        fontSize: 16,
    },
    selectedImage: {
        borderWidth: 3,
        borderColor: "orange",
    }
});