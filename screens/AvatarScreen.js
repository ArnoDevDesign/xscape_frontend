import React, { useState } from "react";
import {
    StyleSheet, View, SafeAreaView, TextInput, Text, TouchableOpacity,
    FlatList, Image, Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';


const { width } = Dimensions.get("window");

export default function AvatarScreen({ navigation }) {
    const [signUpUsername, setSignUpUsername] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const userToken = useSelector((state) => state.users.value.token)
    const dispatch = useDispatch();
    // Images d'avatars avec un ID (Utilise des .png au lieu de .svg)
    const images = [
        require('../assets/avatar01.png'),
        require('../assets/avatar02.png'),
        require('../assets/avatar03.png'),
        require('../assets/avatar04.png'),
    ];

    function register() {
        fetch(`http://192.168.100.230:3000/users/updateProfil`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: userToken, username: signUpUsername, avatar: selectedAvatar })
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    dispatch(addUserToStore({ token: userToken, username: signUpUsername, avatar: selectedAvatar }))
                    console.log(signUpUsername);
                    navigation.navigate('Map');
                }
            })
            .catch(error => console.error('Erreur mise à jour username', error));
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
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => setSelectedAvatar(index)}>
                            <Image
                                source={item}
                                style={[
                                    styles.image,
                                    selectedAvatar === index && styles.selectedImage
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
        borderRadius: '50%', // Correcte au lieu de "50%"
        marginHorizontal: 10,
    },
    selectedImage: {
        borderWidth: 3,
        borderColor: "orange",
    },
});

