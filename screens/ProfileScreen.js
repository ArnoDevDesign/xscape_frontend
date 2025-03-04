import React, { use, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
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
    console.log(newUsername);

    // Récupération des données utilisateur au chargement du composant
    useEffect(() => {
        if (!userToken) {
            console.log("ProfitesScren : Aucun token trouvé !");
            return;
        }
        console.log("ProfitesScren : Token utilisé :", userToken);
        // const testToken = "sfutwCuwD0EFPZlyUyfzmNbob6Q49M6M"
        fetch(`http://192.168.100.230:3000/users/updateProfil`)
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
    }

    //Modification du username au clic 
    const updateUsername = () => {
        fetch(`http://192.168.100.230:3000/users/<NOM_DE_LA_ROUTE>`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: userToken, username: newUsername })
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setUsername(newUsername);
                    setUserModalVisible(false);
                    console.log(newUsername);
                }
            })
            .catch(error => console.error('erreur mise à jour username', error));
    };


    return (
        <View style={styles.generalContainer}>
            <SafeAreaView />

            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Image source={avatar ? { uri: avatar } : require('../assets/Avatar_jojo.png')} style={styles.avatar} />
                <TouchableOpacity onPress={() => setAvatarModalVisible(true)} style={styles.iconEdit} >
                    <FontAwesome name='pencil' size={20} color='black' style={styles.updateUser} />
                </TouchableOpacity>
            </View>

            {/* Modal Modification de l'avatar */}
            {modalAvatarVisible && (
                <Modal visible={modalAvatarVisible} animationType="fade" transparent>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
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
                        <TouchableOpacity onPress={() => setAvatarModalVisible(false)} activeOpacity={0.8}>
                            <Text style={styles.textButton}>Annuler</Text>
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
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
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
    avatarContainer: {
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