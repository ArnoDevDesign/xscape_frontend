import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, Modal, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../reducers/users'
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function ProfileScreen({ navigation }) {
    const dispatch = useDispatch();
    const userToken = useSelector((state) => state.users.value.token)
    // États pour infos utilisateur
    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [score, setScore] = useState('');
    const [scenarios, setScenarios] = useState([]);
    const [modalUserVisible, setUserModalVisible] = useState(false);
    const [modalAvatarVisible, setAvatarModalVisible] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    console.log(newUsername);

    // Images d'avatarts pour test
    const images = [
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar01_zdi0zf.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar02_zrsv6f.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar03_nyapav.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar04_tka0gd.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar05_fui9wm.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar06_jrvz5x.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar07_qr2sxd.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105220/avatar08_cd4udv.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105221/avatar09_bkdrx9.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105221/avatar10_nh5quw.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105222/avatar11_llbefo.png',
        // 'https://res.cloudinary.com/dpyozodnm/image/upload/v1741105222/avatar12_b24cyi.png',
        require('../assets/avatar01.png'),
        require('../assets/avatar02.png'),
        require('../assets/avatar03.png'),
        require('../assets/avatar04.png'),
    ];
    // Récupération des données utilisateur au chargement du composant
    useEffect(() => {
        if (!userToken) {
            console.log("ProfitesScren : Aucun token trouvé !");
            return;
        }
        console.log("ProfitesScren : Token utilisé :", userToken);
        // const testToken = "sfutwCuwD0EFPZlyUyfzmNbob6Q49M6M"
        fetch(`http://192.168.100.230:3000/users/${userToken}`)
            .then(response => response.json())
            .then(data => {
                console.log('Données utilisateur récupérées:', data);
                setAvatar(data.avatar);
                setUsername(data.username);
                setEmail(data.email);
                setScore(data.totalPoints);
                setScenarios(data.scenarios || []);
            })
            .catch(error => console.error('ProfitesScren : Erreur de récupération des données:', error));
    }, [userToken]);


    //Fonction de déconnexion 
    const handleLogout = () => {
        dispatch(userLogout());
        navigation.navigate('Home');
        console.log('Déconnexion');
    }

    //Modification du username et token au clic 
    const updateUsername = () => {
        fetch(`http://192.168.100.230:3000/users/updateProfil`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: userToken, username: newUsername, avatar: selectedAvatar })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Utilisateur mis à jour') {
                    setUsername(newUsername);
                    setAvatar(selectedAvatar);
                    setUserModalVisible(false);
                    setAvatarModalVisible(false);
                    console.log("Mise à jour réussie !");
                    alert('Profil mis à jour');
                    console.log(selectedAvatar);
                } else {
                    console.log('Erreur mise à jour', data);
                    alert('Erreur lors de la mise à jour');
                }
            })
            .catch(error => console.error('erreur mise à jour username', error));
    };

    console.log("Selected Avatar:", selectedAvatar);
    console.log("Avatar affiché:", images[selectedAvatar]);
    console.log("Liste d'images disponibles:", images);

    return (
        <View style={styles.generalContainer}>
            <SafeAreaView />

            {/* Avatar */}
            <View style={styles.avatarContainerMain}>
            <Image source={selectedAvatar !== null ? images[selectedAvatar] : require('../assets/Avatar_jojo.png')} style={styles.avatar} />

                {/* <Image source={avatar ? { uri: avatar } : require('../assets/Avatar_jojo.png')} style={styles.avatar} /> */}
                <TouchableOpacity onPress={() => setAvatarModalVisible(true)} style={styles.iconEdit} >
                    <FontAwesome name='pencil' size={20} color='black' style={styles.updateUser} />
                </TouchableOpacity>
            </View>

            {/* Modal Modification de l'avatar */}
            {modalAvatarVisible && (
                <Modal visible={modalAvatarVisible} transparent animationType="slide">
                    <View style={styles.centeredViewAvatar}>
                        <View style={styles.modalViewAvatar}>
                            <Text style={styles.text}>Choisis ton avatar</Text>
                            {/* Carousel d'avatars */}
                            <FlatList
                                data={images}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                // keyExtractor={(item, index) => index.toString()} //à vérifier pour les urls
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => setSelectedAvatar(item)}>
                                        <Image
                                            source={item} // `require()` fonctionne ici
                                            style={[
                                                styles.image,
                                                selectedAvatar === index && styles.selectedImage
                                            ]}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setAvatarModalVisible(false)} style={styles.buttonBack}>
                                <Text style={styles.text}>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Infos utilisateur */}
            <View style={styles.usernameView}>
                <Text style={styles.text}>Username : {username}</Text>

                <TouchableOpacity onPress={() => setUserModalVisible(true)} style={styles.iconEdit} >
                    <FontAwesome name='pencil' size={20} color="black" style={styles.updateUser} />
                </TouchableOpacity>
                <Text style={styles.text}>Email : {email}</Text>
            </View>

            {/* Modal Modification de l'username */}
            {modalUserVisible && (
                <Modal visible={modalUserVisible} animationType="fade" transparent>
                    <View style={styles.centeredViewUser}>
                        <View style={styles.modalViewUser}>
                            <Text style={styles.textButton}>Choisissez un nouveau Pseudo</Text>
                            <TextInput
                                placeholderTextColor={'black'}
                                style={styles.inp1}
                                placeholder="Nouveau Pseudo"
                                onChangeText={setNewUsername}
                                value={newUsername}
                            />
                            <TouchableOpacity onPress={() => updateUsername()} activeOpacity={0.8}>
                                <Text style={styles.textButton}>GO!</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setUserModalVisible(false)} activeOpacity={0.8}>
                                <Text style={styles.textButton}>Annuler</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Infos Scrore */}
            <Text style={[styles.text, styles.score]}>Score : {score}</Text>

            {/* Infos scenarios */}
            <View style={styles.aventureView}>
                <Text style={styles.text}>Aventures terminées :</Text>
                {scenarios.length > 0 ? (
                    scenarios.map((DataScenario, index) => (
                        <Text key={index} style={styles.text}>• {DataScenario}</Text>
                    ))
                ) : (
                    <Text style={styles.text}>Aucune aventure terminée</Text>
                )}
            </View>

            {/* Boutons */}
            <TouchableOpacity style={styles.buttonLogOut}>
                <Text onPress={() => handleLogout()} style={styles.text}>Déconnexion</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.buttonBack}>
                <Text style={styles.text}>Retour MAP</Text>
            </TouchableOpacity>

            <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />

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
    },

    // Icon style
    iconEdit: {
        position: "absolute",
        top: 5,
        right: 5,
        // backgroundColor: 'white',
        opacity: 0.8,
        boderRadius: 10,
        padding: 5,
        // elevation: 1, //effet d'ombre Android
        // shadowColor: '#000', //effet d'ombre IOS
        // shadowOffset: {width: 0, height: 2},
        // shadowOpacity: 0.2,
        // shadowRadius: 2,
    },

    // Avatar style
    avatarContainerMain: {
        width: '45%',
        height: '25%',
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },

    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    //Modal Avatar Style

    centeredViewAvatar: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalViewAvatar: {
        backgroundColor: 'transparent',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        margin: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },

    selectedImage: {
        borderWidth: 2,
        borderColor: 'blue',
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

// MODAL STYLE FABIO : A VERIFIER !!!
    // avatarContainer: {
    //     width: '100%',
    //     height: '60%',
    //     alignItems: 'center',
    //     backgroundColor: 'grey',
    //     opacity: 0.5,
    // },

    // carousel: {
    //     paddingHorizontal: 10,
    //     alignItems: "center",
    //     backgroundColor: 'green',
    //     opacity: 0.5,
    // },
    // image: {
    //     width: 'width' * 0.25, // 25% de la largeur de l'écran
    //     height: 'width' * 0.25, // Garde une forme carrée
    //     borderRadius: 9999, // Assure un cercle parfait
    //     marginHorizontal: 10,
    //     backgroundColor: 'transparent', // Supprime le bleu
    // },


    // Username style
    usernameView: {
        backgroundColor: 'blue',
        opacity: 0.5,
        padding: 10,
        width: '80%',
        alignItems: 'center',
        borderRadius: 10,
    },

    //Modal Username Style
    centeredViewUser: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalViewUser: {
        backgroundColor: 'orange',
        borderRadius: 30,
        alignItems: 'center',
        width: 300,
        height: 200,
        elevation: 5,
    },
    inp1: {
        width: '70%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 10,
        paddingLeft: 10
    },
    textButton: {
        fontSize: 20
    },

    // Score Style
    score: {
        backgroundColor: 'yellow',
        opacity: 0.5,
        padding: 10,
        width: '80%',
        textAlign: 'center',
        borderRadius: 10,
    },
    //Scenario Style
    aventureView: {
        backgroundColor: 'green',
        opacity: 0.5,
        padding: 10,
        width: '80%',
        alignItems: 'center',
        borderRadius: 10,
    },

    //Bouton Style
    buttonLogOut: {
        padding: 15,
        backgroundColor: 'orange',
        opacity: 0.5,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
    },

    buttonBack: {
        padding: 15,
        backgroundColor: 'red',
        opacity: 0.5,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
    },

    text: {
        color: 'black',
        fontSize: 16,
    },
});