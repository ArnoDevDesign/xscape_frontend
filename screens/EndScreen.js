import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, Modal, TextInput, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addUserToStore, userLogout } from '../reducers/users'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const URL = process.env.EXPO_PUBLIC_BACKEND_URL
export default function EndScreen({ navigation }) {
    const dispatch = useDispatch();
    const userRedux = useSelector((state) => state.users.value)
    const username = userRedux.username
    const [validated, setValidated] = useState('')
    const [conclusionScenario, setConclusionScenario] = useState('')
    const [conclucionscenariofailed, setconclucionscenariofailed] = useState('')
    const [score, setScore] = useState(0)
    // const [note, setNote] = useState(0)
    // const [noteMoyenne, setNoteMoyenne] = useState(0)
    // const [nombreNotes, setNombreNotes] = useState(0)

    useEffect(() => {
        fetch(`${URL}/scenarios/${userRedux.scenario}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setConclusionScenario(data.conclusionScenario)
                setconclucionscenariofailed(data.conclusionScenarioFailed) //// il faut creer texte de conclusion en cas d'echec
                setScore(data.score)//////////////// il me faut score dans le backend
                setValidated(data.sessions)
                    .catch((error) => {
                        console.error('Error:', error);
                    })
            });
    }, [])


    return (
        <View style={styles.container}>
            <SafeAreaView />
            <View style={styles.titleBox}>
                {validated ? <Text style={styles.textTitle}>BRAVO ! Mission Accomplie {username}, et avec BRIO !!!</Text> : <Text style={styles.textTitle}>Dommage {username}, vous n'avez pas réussi à nous sauver à temps...</Text>}
            </View>
            {validated ? <ScrollView style={styles.conclusionBox}>
                <Text style={styles.textConclusion}>{conclusionScenario}</Text>
            </ScrollView> : <ScrollView style={styles.conclusionBox}>
                <Text style={styles.textConclusion}>{conclucionscenariofailed}</Text>
            </ScrollView>}
            <View style={styles.buttonContainer}>
                {validated && <Text style={styles.points}>Vous avez gagné {score} points !</Text>}
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
                    <Text style={styles.textButton}>Retour à l'accueil</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'green',
        justifyContent: "center",
        alignItems: 'center'
    },
    titleBox: {
        flex: 1,
        width: '80%',
        backgroundColor: 'green',
        justifyContent: "center",
        alignItems: 'center'
    },
    conclusionBox: {
        flex: 1,
        width: '80%',
        backgroundColor: 'green',
        // justifyContent: "center",
        // alignItems: 'center'
    },
    buttonContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: 'green',
        justifyContent: "center",
        alignItems: 'center'
    },
    textTitle: {
        fontSize: 40,
        color: 'white',
        textAlign: 'center'
    },
    textConclusion: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    textStars: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        height: 50,
        width: '80%',
    },
    textButton: {
        fontSize: 20,
        color: 'green',
        textAlign: 'center'
    }
})