import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Button, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from '@react-navigation/native';
import { userLogout } from '../reducers/users'

export default function ProfileScreen({ navigation }) {
    const dsipatch = useDispatch();
    // const userToken = useSelector((state) => state.users.value.token)
    // États pour infos utilisateur
    const [avatar, setAvatar] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [score, setscore] = useState('');
    const [scenarios, setscenarios] = useState([]);

    // Récupération des données utilisateur au chargement du composant
    // useEffect(() => {
    //     if (!userToken) return;

        fetch(`http://192.168.100.229:3000/user/VeknOr19PM9DVp4S4ohPXj6SM-tSN3hR`)
            .then(response => response.json())
            .then(data => {
                console.log('Données utilisateur récupérées:', data);
                setAvatar(data.avatar);
                setUsername(data.username);
                setEmail(data.email);
                setScore(data.totalPoints);
                setScenarios(data.scenarios || []);
            })
    //         .catch(error => console.error('Erreur de récupération des données:', error));
    // }, [userToken]);


    //Fonction de déconnexion 
    const handleLogout = () => {
        dispatch(userLogout());
        navigation.navigate('Home');
    }

    return (
        <View style={styles.generalContainer}>
            <SafeAreaView />
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Image source={avatar ? { uri: avatart } : require('../assets/icon.png')} style={styles.avatar} />
            </View>

            {/* Infos utilisateur */}
            <View style={styles.usernameView}>
                <Text style={styles.text}>Username : {username}</Text>
                <Text style={styles.text}>Email : {email}</Text>
            </View>

            <Text style={[styles.text, styles.score]}>Score : {score}</Text>

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


const styles = StyleSheet.create({
    generalContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
    },

    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
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

    usernameView: {
        backgroundColor: 'blue',
        opacity: 0.5,
        padding: 10,
        width: '80%',
        alignItems: 'center',
        borderRadius: 10,
    },

    score: {
        backgroundColor: 'yellow',
        opacity: 0.5,
        padding: 10,
        width: '80%',
        textAlign: 'center',
        borderRadius: 10,
    },

    aventureView: {
        backgroundColor: 'green',
        opacity: 0.5,
        padding: 10,
        width: '80%',
        alignItems: 'center',
        borderRadius: 10,
    },

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