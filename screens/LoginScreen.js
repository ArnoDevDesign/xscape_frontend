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
            // lorsque la modale apparait, les boutons inscription et connexion disparaissent -> fin ligne 120
            {!modalLogIn && !modalSignUp && (
                <View style={styles.signContainer}>
                    
                    <TouchableOpacity style={styles.button} onPress={() => setmodalLogIn(true)}>
                        <Text style={styles.textButton}>Se connecter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setmodalSignUp(true)}>
                        <Text style={styles.textButton}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            )}
            {/* Modal Log in */}
            {modalLogIn && (
                <Modal visible={modalLogIn} animationType="fade" transparent>
                    <View style={styles.centeredView}>
                        <View style={styles.modalViewLogin}>
                            <Text style={{ fontSize: 30, color: '#009EBA', paddingBottom: 60 }}>Connexion</Text>
                            <TextInput
                                placeholderTextColor={'#636773'}
                                fontSize={15}
                                style={styles.inp1}
                                placeholder="Email"
                                onChangeText={setEmail}
                                value={email}
                            />
                            <View style={styles.inp1}>
                                <TextInput
                                    placeholderTextColor={'#636773'}
                                    fontSize={15}
                                    placeholder="Mot de passe"
                                    secureTextEntry={showPasswordConnection ? true : false}
                                    onChangeText={setLogInPassword}
                                    value={logInPassword}
                                />
                                {checkEmail && <Text>Email invalide</Text>}
                                <TouchableOpacity onPress={() => setShowPasswordConnection(!showPasswordConnection)}>
                                    <FontAwesome name={showPasswordConnection ? 'eye' : 'eye-slash'} color={'#636773'} size={20} paddingRight={20} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[styles.loginButton]} onPress={logIN} activeOpacity={0.8}>
                                <Text style={[styles.textLoginButton]}>Se connecter</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setmodalLogIn(false)} activeOpacity={0.8}>
                                <Text style={[styles.textButton, { color: "#85CAE4" }, { fontWeight: "400" }]}>Fermer</Text>
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
                            <View style={styles.modalViewsignup}>
                                <Text style={{ fontSize: 30, paddingBottom: 50, color: '#009EBA' }}>Inscription</Text>
                                <TextInput
                                    placeholderTextColor={'#636773'}
                                    fontSize={15}
                                    style={styles.inp1}
                                    placeholder="Email"
                                    onChangeText={mailcheck}
                                    value={email}
                                />
                                {checkEmail && <Text>Email invalide</Text>}

                                < View style={styles.inp1} >
                                    <TextInput
                                        placeholderTextColor={'#636773'}
                                        fontSize={15}
                                        placeholder="Mot de passe"
                                        secureTextEntry={showPassword ? true : false}
                                        onChangeText={setSignUpPassword}
                                        value={signUpPassword}
                                    />
         // incorporation de l'icone de visibilité du MDP.
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} color={'#636773'} size={20} paddingRight={12} />
                                    </TouchableOpacity>
                                </View >
                                <View style={styles.inp1}>
                                    <TextInput
                                        placeholderTextColor={'#636773'}
                                        fontSize={15}
                                        placeholder="Confirmation du mot de passe"
                                        secureTextEntry={showPassword2 ? true : false}
                                        onChangeText={setConfirmPassword}
                                        value={confirmPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
                                        <FontAwesome name={showPassword2 ? 'eye' : 'eye-slash'} color={'#636773'} size={20} paddingRight={12} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.signupButton} onPress={signUP} activeOpacity={0.8}>
                                    <Text style={styles.textsignupButton}>S'inscrire</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setmodalSignUp(false)} activeOpacity={0.8}>
                                    <Text style={[styles.textButton, { color: "#85CAE4" }, { fontWeight: "400" }]}>Fermer</Text>
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
        backgroundColor: "#85CAE4"
    },
    signContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '80%',
        color: "white",
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: "10",
        width: '80%',
        height: 72,
        color: "white",
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 16,
        elevation: 4,
    },
    textButton: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "#FF8527",
        padding: 10,
    },
    loginButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: 72,
        color: "white",
        backgroundColor: '#FF8527',
        margin: 20,
        marginTop: 70,
        borderRadius: 15,
        elevation: 3,
        // fontSize: 20,
    },
    textLoginButton: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "white",
        padding: 10,
    },
    signupButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: 72,
        color: "white",
        backgroundColor: '#FF8527',
        margin: 20,
        marginTop: 70,
        borderRadius: 15,
        elevation: 3,
    },
    textsignupButton: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        alignContent: 'flex-end',
        justifyContent: 'center',
        color: "white",
        padding: 10,
    },
    textButtonBlue: {
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // color: "white",
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalViewLogin: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        paddingTop: 30,
        
        paddingBottom: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        elevation: 5,
    },
    modalViewsignup: {
        backgroundColor: '#FFFFFF',
        // height: '70%',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingTop: 30,
        paddingBottom: 30,
        elevation: 5,
    },
    inp1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        height: 60,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        margin: 10,
        paddingLeft: 10
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 20,
    },
});