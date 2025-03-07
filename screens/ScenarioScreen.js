import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToStore, userLogout } from '../reducers/users';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

const URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ScenarioScreen({ navigation }) {

    const dispatch = useDispatch();
    const userRedux = useSelector((state) => state.users.value)
    const scenarioUpdated = encodeURIComponent(userRedux.scenario); /// fonction remplacant tous les caracteres speciaux pour les rendre comprehensibles par le fetch


    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [difficulte, setdifficulte] = useState('')
    const [theme, setTheme] = useState('')
    const [duree, setDuree] = useState('')

    useEffect(() => {
        fetch(`${URL}/scenarios/${userRedux.scenario}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                setTitle(data.name);
                setDescription(data.descriptionScenario);
                setdifficulte(data.difficulte)
                setTheme(data.theme)
                setDuree(data.duree);
                // console.log(data.difficulte)
                // console.log(data)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [userRedux])

    return (
        <View style={styles.container}>
            {/* <SafeAreaView /> */}
            <View style={styles.name}>
                <Text style={styles.textTitre}>{userRedux.scenario}</Text>
            </View>
            <ScrollView style={styles.description}>
                <Text style={styles.textDescripiton}>{description}</Text>
            </ScrollView>
            <View style={styles.difficultee}>
                <Text style={styles.textDif}>Difficulté : {difficulte}</Text>
            </View>
            <View style={styles.infos}>
                <Text style={styles.textInfo}>Theme : {theme} , Duree : {duree}mn </Text>
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => navigation.navigate('StartGame')}>
                    <Text style={styles.buttonText}>C'est Parti !</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue',
        justifyContent: "space-around",
        alignItems: 'center',
        padding: 20,
    },
    name: {
        marginTop: '40',
        justifyContent: "center",
        alignItems: 'center',
        width: '100%',
        // backgroundColor: 'green',
        // opacity: '0.5'
    },
    textTitre: {
        fontSize: 60,
        color: '#fff',
        marginBottom: 10,
    },
    description: {
        // justifyContent: "center",
        // alignItems: 'center',
        width: '100%',
        width: '75%'
    },
    textDescripiton: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    difficultee: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: 'center',
        width: '100%'
    },
    textDif: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    infos: {
        justifyContent: "center",
        alignItems: 'center',
        width: '100%'
    },
    textInfo: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        width: "100%",
        justifyContent: "center",
        alignItems: 'center',
    },
    buttonStyle: {
        backgroundColor: "#3498db",
        padding: 10,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 5,
        width: '80%',
        height: 50,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    }
});
