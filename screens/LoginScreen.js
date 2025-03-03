import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, Button, TextInput, Text, Modal, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { addUserToStore } from '../reducers/users';

export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch();

    const [modalSignUp, setmodalSignUp] = useState(false);
    const [modalLogIn, setmodalLogIn] = useState(false);

    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [logInUsername, setLogInUsername] = useState('');
    const [logInPassword, setLogInPassword] = useState('');

    function signUP() {
        // fetch('http://localhost:3000/users/signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ username: signUpUsername, password: signUpPassword }),
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.result) {
        dispatch(addUserToStore({ username: signUpUsername/*,token: data.token*/ }));
        setSignUpUsername('');
        setSignUpPassword('');
        setmodalSignUp(false);
        console.log(signUpUsername)
        navigation.navigate('TabNavigator');
        //     } else {
        //         alert('Informations incorrectes ou manquantes.');
        //     }
        // })
    };

    function logIN() {
        // fetch('http://localhost:3000/users/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ username: logInUsername, password: logInPassword }),
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.result) {
        dispatch(addUserToStore({ username: logInUsername/*, token: data.token*/ }));
        setLogInUsername('');
        setLogInPassword('');
        setmodalLogIn(false);
        console.log(logInUsername)
        navigation.navigate('TabNavigator');
        //     } else {
        //         alert('Nom d’utilisateur ou mot de passe incorrect.');
        //     }
        // })
    };

    return (
        <View style={styles.generalContainer}>
            <SafeAreaView />
            <View style={styles.signContainer}>
                <Text>Ravie de te revoir.</Text>
                <TouchableOpacity style={styles.buttons} onPress={() => setmodalLogIn(true)}>
                    <Text>Se connecter</Text>
                </TouchableOpacity>
                <Text>Pas encore de compte ?</Text>
                <TouchableOpacity style={styles.buttons} onPress={() => setmodalSignUp(true)}>
                    <Text>S'inscrire</Text>
                </TouchableOpacity>
                <Button title="Go to Home" onPress={() => navigation.navigate('TabNavigator')} />
            </View>

            // modal Log in
            {modalLogIn && (
                <Modal visible={modalLogIn} animationType="fade" transparent>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.textButton}>Connexion</Text>
                            <TextInput
                                placeholderTextColor={'black'}
                                style={styles.inp1}
                                placeholder="Email"
                                onChangeText={setLogInUsername}
                                value={logInUsername}
                                type="email"
                            />
                            <TextInput
                                placeholderTextColor={'black'}
                                style={styles.inp1}
                                placeholder="Mot de passe"
                                secureTextEntry
                                onChangeText={setLogInPassword}
                                value={logInPassword}
                            />
                            <TouchableOpacity onPress={logIN} activeOpacity={0.8}>
                                <Text style={styles.textButton}>GO!</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setmodalLogIn(false)} activeOpacity={0.8}>
                                <Text style={styles.textButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

//modal sign up
            {
                modalSignUp && (
                    <Modal visible={modalSignUp} animationType="fade" transparent>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.textButton}>SIGN UP</Text>
                                <TextInput
                                    placeholderTextColor={'black'}
                                    style={styles.inp1}
                                    placeholder="Email"
                                    onChangeText={setSignUpUsername}
                                    value={signUpUsername}
                                    type="email"
                                />
                                <TextInput
                                    placeholderTextColor={'black'}
                                    style={styles.inp1}
                                    placeholder="Username"
                                    onChangeText={setSignUpUsername}
                                    value={signUpUsername}
                                />
                                <TextInput
                                    placeholderTextColor={'black'}
                                    style={styles.inp1}
                                    placeholder="Password"
                                    secureTextEntry
                                    onChangeText={setSignUpPassword}
                                    value={signUpPassword}
                                />
                                <TouchableOpacity onPress={signUP} activeOpacity={0.8}>
                                    <Text style={styles.textButton}>GO!</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setmodalSignUp(false)} activeOpacity={0.8}>
                                    <Text style={styles.textButton}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )
            }
        </View>
    );
}



const styles = StyleSheet.create({
    generalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "grey"
    },
    signContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 50,
        backgroundColor: 'orange',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 300,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: 'orange'
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
        marginTop: 20,
        marginBottom: 20,
        fontSize: 20
    }
});
