import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
    const [difficultee, setdifficultee] = useState('')
    const [theme, setTheme] = useState('')
    const [duree, setDuree] = useState('')

    useEffect(() => {
        fetch(`${URL}/scenarios/${scenarioUpdated}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTitle(data.name);
                setDescription(data.descriptionScenario);
                setdifficultee(data.difficultee)
                setTheme(data.theme)
                setDuree(data.duree);
            })
    }, [userRedux])

    return (
        <View style={styles.container}>
            {/* <SafeAreaView /> */}
            <View style={styles.name}>
                <Text style={styles.textTitre}>{scenarioUpdated}</Text>
            </View>
            <View style={styles.description}>
                <Text style={styles.textDescripiton}>Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès qu'il est prêt ou que la mise en page est achevée</Text>
            </View>
            <View style={styles.difficultee}>
                <Text style={styles.textDif}>Difficulté : Moyen</Text>
            </View>
            <View style={styles.infos}>
                <Text style={styles.textInfo}>Infos supplémentaires</Text>
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
        justifyContent: "center",
        alignItems: 'center',
        width: '100%',
        width: '75%'
    },
    textDescripiton: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    difficultee: {
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
