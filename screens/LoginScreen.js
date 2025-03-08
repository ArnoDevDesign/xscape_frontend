import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView, Button, TextInput, Text, Modal, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { addUserToStore } from '../reducers/users';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const URL = process.env.EXPO_PUBLIC_BACKEND_URL
const { checkBody } = require('../modules/checkBody');

export default function LoginScreen({ navigation }) {
    const dispatch = useDispatch();
    const [showPasswordConnection, setShowPasswordConnection] = useState(true);
    const [showPassword, setShowPassword] = useState(true);
    const [showPassword2, setShowPassword2] = useState(true);

    const [modalSignUp, setmodalSignUp] = useState(false);
    const [modalLogIn, setmodalLogIn] = useState(false);


    const [signUpPassword, setSignUpPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [logInUsername, setLogInUsername] = useState('');
    const [logInPassword, setLogInPassword] = useState('');
    const [email, setEmail] = useState('');
    const [checkEmail, setcheckEmail] = useState(false);


    function signUP() {
        console.log("Tentative d'inscription avec :", { email, signUpPassword, confirmPassword });

        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!pattern.test(email.trim())) {
            setcheckEmail(true);
            // alert("Veuillez entrer un email valide.");
            return;
        }

        if (!email.trim() || !signUpPassword.trim() || !confirmPassword.trim()) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        if (signUpPassword !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        fetch(`${URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim().toLowerCase(), password: signUpPassword.trim() }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    dispatch(addUserToStore({ token: data.token, userID: data._id }));
                    console.log(data._id)
                    setSignUpPassword('');
                    setEmail('');
                    setmodalSignUp(false);
                    console.log("Inscription réussie :", email);
                    navigation.navigate('Avatar');
                } else {
                    alert('utilisateur deja present');
                }
            })
            .catch(error => console.error("LoginScreen : Erreur lors de l'inscription :", error));
    }


    function mailcheck(value) {
        setEmail(value);
        setcheckEmail(false)
    }

    function logIN() {
        console.log("Tentative de connection avec :", { email, logInPassword, });

        if (!email.trim() || !logInPassword.trim()) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        fetch(`${URL}/users/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim().toLowerCase(), password: logInPassword.trim().toLowerCase() }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    dispatch(addUserToStore({ token: data.token, avatar: data.avatar, username: data.username, userID: data._id }));
                    setEmail('');
                    setLogInPassword('');
                    setmodalLogIn(false);
                    console.log("Connexion réussie :", email);
                    navigation.navigate('TabNavigator');
                } else {
                    alert('Nom d’utilisateur ou mot de passe incorrect.');
                }
            })
            .catch(error => console.error("Erreur de connexion :", error));
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

            {/* Modal Log in */}
            {modalLogIn && (
                <Modal visible={modalLogIn} animationType="fade" transparent>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.textButton}>Connexion</Text>
                            <TextInput
                                placeholderTextColor={'black'}
                                style={styles.inp1}
                                placeholder="email"
                                onChangeText={setEmail}
                                value={email}
                            />
                            <View style={styles.inp2}>
                                <TextInput
                                    placeholderTextColor={'black'}
                                    placeholder="Mot de passe"
                                    secureTextEntry={showPasswordConnection ? true : false}
                                    onChangeText={setLogInPassword}
                                    value={logInPassword}
                                />
                                {checkEmail && <Text>Email invalide</Text>}
                                <TouchableOpacity onPress={() => setShowPasswordConnection(!showPasswordConnection)}>
                                    <FontAwesome name={showPasswordConnection ? 'eye' : 'eye-slash'} size={25} paddingRight={10} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={logIN} activeOpacity={0.8}>
                                <Text style={styles.textButton}>GO!</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setmodalLogIn(false)} activeOpacity={0.8}>
                                <Text style={styles.textButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )
            }

            {/* Modal Sign up */}
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
                                    onChangeText={mailcheck}
                                    value={email}
                                />
                                {checkEmail && <Text>Email invalide</Text>}

                                < View style={styles.inp2} >
                                    <TextInput
                                        placeholderTextColor={'black'}
                                        placeholder="Mot de passe"
                                        secureTextEntry={showPassword ? true : false}
                                        onChangeText={setSignUpPassword}
                                        value={signUpPassword}
                                    />
         // incorporation de l'icone de visibilité du MDP.
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={25} paddingRight={10} />
                                    </TouchableOpacity>
                                </View >
                                <View style={styles.inp2}>
                                    <TextInput
                                        placeholderTextColor={'black'}
                                        placeholder="Confirmation du mdp"
                                        secureTextEntry={showPassword2 ? true : false}
                                        onChangeText={setConfirmPassword}
                                        value={confirmPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
                                        <FontAwesome name={showPassword2 ? 'eye' : 'eye-slash'} size={25} paddingRight={10} />
                                    </TouchableOpacity>
                                </View>
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
        </View >
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
        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: 'orange',
        borderRadius: 30,
        alignItems: 'center',
        width: 300,
        height: 300,
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
    inp2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '70%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 10,
        paddingLeft: 10
    },
    textButton: {
        fontSize: 20
    }
});