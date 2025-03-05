import React, { useState } from "react";
import {
    StyleSheet, View, SafeAreaView, TextInput, Text, TouchableOpacity,
    FlatList, Image, Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToStore } from '../reducers/users';

const { width } = Dimensions.get("window");
const URL = process.env.EXPO_PUBLIC_BACKEND_URL

export default function AvatarScreen({ navigation }) {
    const [signUpUsername, setSignUpUsername] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const userToken = useSelector((state) => state.users.value.token)
    const dispatch = useDispatch();
    // Images d'avatars avec un ID (Utilise des .png au lieu de .svg)
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

    ];

    function register() {
        console.log('button clicked')

        if (!selectedAvatar || signUpUsername.trim() === "") {// VERIFIE SI LES CHAMPS SONT REMPLI ET EVITE UN ENVOI RDE REQUETE POUR RIEN
            alert("Choisissez un avatar et entrez un pseudo !");
            return;
        } else {
            fetch(`${URL}/users/updateProfil`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: userToken, username: signUpUsername, avatar: selectedAvatar })
            }).then(response => response.json())
                .then(data => {
                    console.log("Réponse API :", data); // AFFICHE LA REPONSE DU BACKEND
                    if (data.result) {
                        dispatch(addUserToStore({ token: userToken, username: signUpUsername, avatar: selectedAvatar }));// ENVCOI LES INFOS SI TOUT VA BIEN 
                        console.log("Utilisateur mis à jour :", signUpUsername);
                        navigation.navigate('Profil');
                    } else {
                        console.log('Erreur de connexion API', data.error);
                        alert("Erreur $$$$: " + data.error);
                    }
                })
                .catch(error => {
                    console.error('Erreur mise à jour username', error);
                    alert("Erreur de connexion au serveur");
                });
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView />

            {/* Titre */}
            <View style={styles.title}>
                <Text style={styles.text}>Choisis ton avatar</Text>
            </View>

            {/* Carousel d'avatars */}
            <View style={styles.avatarContainer}>
                <FlatList
                    data={images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carousel}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedAvatar(item)}>
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
            </View>

            {/* Input et bouton */}
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Choisis ton pseudo</Text>
                <TextInput
                    placeholderTextColor={'black'}
                    style={styles.inp1}
                    placeholder="Pseudo"
                    onChangeText={setSignUpUsername}
                    value={signUpUsername}
                />
                <TouchableOpacity onPress={register} style={styles.buttonLogOut}>
                    <Text style={styles.button}>C'est parti !</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'grey',
        alignItems: 'center',
    },
    inputContainer: {
        padding: 20,
        alignItems: 'center',
        width: '100%',
        height: '30%',
        backgroundColor: 'lightgrey',
        justifyContent: 'space-around',
        paddingBottom: 40
    },
    inp1: {
        marginTop: 10,
        backgroundColor: 'grey',
        width: '80%',
        height: 60,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: 'white',
    },
    avatarContainer: {
        width: '100%',
        height: '60%',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: 'yellow',
    },
    buttonLogOut: {
        borderRadius: 10,
        marginTop: 20,
        backgroundColor: 'yellow',
        width: '80%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        fontSize: 20,
    },
    title: {
        width: '100%',
        height: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue'
    },
    carousel: {
        paddingHorizontal: 10,
        alignItems: "center",
    },
    image: {
        width: width * 0.7, // Taille des avatars ajustée
        height: width * 0.7,
        borderRadius: 50, // Correcte au lieu de "50%"
        marginHorizontal: 10,
    },
    selectedImage: {
        borderWidth: 3,
        borderColor: "orange",
    },
});

