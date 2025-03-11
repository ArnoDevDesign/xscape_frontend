import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addUserToStore, userLogout } from "../reducers/users";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ScenarioScreen({ navigation }) {
  const [loaded] = useFonts({
    "Fustat-Bold.ttf": require("../assets/fonts/Fustat-Bold.ttf"),
    "Fustat-ExtraBold.ttf": require("../assets/fonts/Fustat-ExtraBold.ttf"),
    "Fustat-ExtraLight.ttf": require("../assets/fonts/Fustat-ExtraLight.ttf"),
    "Fustat-Light.ttf": require("../assets/fonts/Fustat-Light.ttf"),
    "Fustat-Medium.ttf": require("../assets/fonts/Fustat-Medium.ttf"),
    "Fustat-Regular.ttf": require("../assets/fonts/Fustat-Regular.ttf"),
    "Fustat-SemiBold.ttf": require("../assets/fonts/Fustat-SemiBold.ttf"),
    "Homenaje-Regular.ttf": require("../assets/fonts/Homenaje-Regular.ttf"),
    "PressStart2P-Regular.ttf": require("../assets/fonts/PressStart2P-Regular.ttf"),
    "Righteous-Regular.ttf": require("../assets/fonts/Righteous-Regular.ttf"),
    "Goldman-Regular.ttf": require("../assets/fonts/Goldman-Regular.ttf"),
    "Goldman-Bold.ttf": require("../assets/fonts/Goldman-Bold.ttf"),
    "FugazOne-Regular.ttf": require("../assets/fonts/FugazOne-Regular.ttf"),
  });

  useEffect(() => {
    // cacher l'écran de démarrage si la police est chargée ou s'il y a une erreur
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Retourner null tant que la police n'est pas chargée
  if (!loaded) {
    return null;
  }

  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.users.value);
  const scenarioUpdated = encodeURIComponent(userRedux.scenario); /// fonction remplacant tous les caracteres speciaux pour les rendre comprehensibles par le fetch

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulte, setdifficulte] = useState("");
  const [theme, setTheme] = useState("");
  const [duree, setDuree] = useState("");

  useEffect(() => {
    console.log("Redux state:", userRedux);
    console.log("scenario updates avant fetch", scenarioUpdated);
    fetch(`${URL}/scenarios/${scenarioUpdated}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setTitle(data.name);
        setDescription(data.descriptionScenario);
        setdifficulte(data.difficulte);
        setTheme(data.theme);
        setDuree(data.duree);
        // console.log(data.difficulte)
        // console.log(data)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [userRedux]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
        
      <View style={styles.container}>
      <ImageBackground
      source={require ("../assets/fonX.png")} // Remplacez par le chemin de votre image
      style={styles.backgroundImage}>

        <View style={styles.name}>
          <Text style={styles.textTitre}>{userRedux.scenario}</Text>

          {/* Ajout du dégradé gris → noir */}
          <LinearGradient
            colors={["#333", "#000"]} // Gris foncé à Noir
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fondTextDescripiton}
          >
            <Text style={styles.textDescripiton}>{description}</Text>
          </LinearGradient>

          <View style={styles.infos}>
            <Text style={styles.textInfo}>Difficulté : {difficulte}</Text>
            <Text style={styles.textInfo}>Thème : {theme}</Text>
            <Text style={styles.textInfo}>Durée : {duree}min</Text>
          </View>
        </View>

        <View style={styles.button}>
          <View style={styles.glowEffect} />
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => navigation.navigate("StartGame")}
          >
            <Text style={styles.buttonText}>C'est Parti !</Text>
          </TouchableOpacity>
        </View>
        
      </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#484D5B",
  },

  backgroundImage: {
    flex: 1,
  },

  textTitre: {
    fontFamily: "Goldman-Bold.ttf",
    lineHeight: 46,
    fontSize: 50,
    color: "black",
    marginTop: 40,
    marginRight: 40,
    marginLeft: 40,
    marginBottom: 30,
  },

  fondTextDescripiton: {
    backgroundColor: "black",
    marginRight: 30,
    marginLeft: 30,
    borderRadius: 30,
    borderWidth: 8,
  },

  textDescripiton: {
    fontFamily: "PressStart2P-Regular.ttf",
    lineHeight: 18,
    fontSize: 10,
    color: "#72BF11",
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },

  infos: {
    marginLeft: 40,
    width: "100%",
    marginTop: 20,
  },

  textInfo: {
    fontFamily: "Goldman-Regular.ttf",
    fontSize: 18,
    lineHeight: 20,
    color: "Black",
  },

  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonStyle: {
    backgroundColor: "#72BF11",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "80%",
    height: 64,
    borderColor: "#2F3545",
    borderWidth: 5,
  },

  buttonText: {
    fontFamily: "Goldman-Bold.ttf",
    color: "black",
    fontSize: 20,
  },
});
