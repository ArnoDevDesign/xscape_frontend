// Composants
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Map
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// Icones
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Etats & Redux
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserToStore } from "../reducers/users";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";



SplashScreen.preventAutoHideAsync();


// URL back
const URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// distances d'entré dans le périmètre d'un jeu
const PROXIMITY_THRESHOLD = 100;

// calcule de la distance entre l'utilisateur et un jeu
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function MapScreen({ navigation }) {

  const [loaded] = useFonts({
    "Fustat-Bold.ttf": require("../assets/fonts/Fustat-Bold.ttf"),
    "Fustat-ExtraBold.ttf": require("../assets/fonts/Fustat-ExtraBold.ttf"),
    "Fustat-ExtraLight.ttf": require("../assets/fonts/Fustat-ExtraLight.ttf"),
    "Fustat-Light.ttf": require("../assets/fonts/Fustat-Light.ttf"),
    "Fustat-Medium.ttf": require("../assets/fonts/Fustat-Medium.ttf"),
    "Fustat-Regular.ttf": require("../assets/fonts/Fustat-Regular.ttf"),
    "Fustat-SemiBold.ttf": require("../assets/fonts/Fustat-SemiBold.ttf"),
    "Homenaje-Regular.ttf": require("../assets/fonts/Homenaje-Regular.ttf"),
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

  // État pour la position de l'utilisateur
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  // États pour l'affichage de la modale
  const [modalInfo, setModalInfo] = useState(false);
  const [modalExpanded, setModalExpanded] = useState(false);

  // États pour l'affichage des markers et des infos dans la modale
  const [scenariosData, setScenariosData] = useState([]);
  const [modalGameName, setModalGameName] = useState("");
  const [modalGameDuration, setModalGameDuration] = useState("");
  const [modalGameInfo, setModalGameInfo] = useState("");
  const [modalGameTheme, setModalGameTheme] = useState("");
  const [passageaujeu, setPassageaujeu] = useState(false);
  // État pour envoyer la bonne aventure
  const [selectedScenario, setSelectedScenario] = useState(null);

  // État pour l'activation du bouton de démarrage de l'aventure
  const [isUserNear, setIsUserNear] = useState(false);

  // États pour gérer les transitions et erreurs
  const [isLoading, setIsLoading] = useState(true);
  const [geolocationError, setGeolocationError] = useState(false);
  const [fadeIn, setFadeIn] = useState(new Animated.Value(0)); // Contrôle l'animation de fondu


  // Récupération des données de l'utilisateur
  const userRedux = useSelector((state) => state.users.value);

  // Initialisation du dispatch pour envoyé les données
  const dispatch = useDispatch();

  // Référence pour la carte
  const mapRef = useRef(null);

  // modification de l'url de l'image de l'avatar pour la mettre au bon format afin de l'utiliser comme marker
  const newFormatAvatar = userRedux.avatar.includes("/upload/")
    ? userRedux.avatar.replace("/upload/", "/upload/w_230,h_230,r_30/")
    : userRedux.avatar;

  // Personnalisation du Marker jeux
  const gameMarker = {
    scenario: require("../assets/pinGameok.png"),
  };

  // Fonction pour choisir le scénario
  const choosenScenario = (data) => {
    fetch(
      `${URL}/scenarios/createSession/${userRedux.scenarioID}/${userRedux.userID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: userRedux.scenarioID,
          userId: userRedux.userID,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("log de creation de session", data.validatedEpreuves);
        if (data.validatedEpreuves == 0 || data.validatedEpreuves == null) {
          console.log("zero etape fini")
          navigation.navigate("Scenario");
        } else if (data.validatedEpreuves !== 0) {
          console.log(" quelques etapes finis")
          navigation.navigate(`Ingame${data.validatedEpreuves + 1}`);
        } else if (data.validatedEpreuves >= data.numberEpreuves) {
          console.log("toutes les etapes finis")
          navigation.navigate("End");
        }
      })
    dispatch(
      addUserToStore({
        scenario: data.scenario, // Met à jour la clé scenario
        scenarioID: data.scenarioID, // Met à jour la clé scenarioID
      })
    )
    setTimeout(() => {
      setModalInfo(false)
    }, 500); // Ferme la modale
    // setPassageaujeu(true); // Passe à la page du jeu
  };
  ////////////////////////////////////////////////////////////// creer conditiion pour afficher la bonne page en fonction de l'etape deja realiser //////////////////////////////



  // Géolocalisation de l'utilisateur
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      // Demande de permission pour la géolocalisation
      if (status === "granted" && isFocused) {
        // Si autorisation alors on récupère la position
        Location.watchPositionAsync({ distanceInterval: 10 }, (loc) => {
          setUserLocation(loc.coords);
          setIsLoading(false); // État de chargement à false
          setGeolocationError(false); // Pas d'erreur de géolocalisation
          // Animation de fondu de 0 à 1 (faire apparaître la carte)
          Animated.timing(fadeIn, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        });
      } else {
        setIsLoading(false);
        setGeolocationError(true); // Erreur si la géolocalisation est refusée
      }
    })();
  }, [isFocused]);

  // Récupération des données du scénario depuis la BDD
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await fetch(`${URL}/scenarios`);
        const data = await response.json();
        setScenariosData(data); // Stocke les données des scénarios dans l'état "scenariosData"
        console.log("selectedScenario", selectedScenario);
      } catch (error) {
        console.error("Erreur : ", error);
      }
    };

    isFocused && fetchScenarios();
  }, [isFocused]);

  const recenterMapOnPinUser = () => {
    const { latitude, longitude } = userLocation;
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.008,
      },
      1000
    );
  };

  return isLoading ? (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#009EBA" />
        <Text style={styles.loaderText}>Chargement...</Text>
      </View>
    </SafeAreaView>
  ) : geolocationError ? (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.loaderContainer}>
        <Text style={styles.errorMessage}>Accès à la géolocalisation refusé</Text>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={[styles.mapContainer, { opacity: fadeIn }]}>
        <View style={styles.container}>
          <View style={styles.mapContainer2}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: userLocation.latitude || 48.866667,
                longitude: userLocation.longitude || 2.333333,
                latitudeDelta: 0.01,
                longitudeDelta: 0.008,
              }}
            >
              {userLocation && (
                <Marker
                  coordinate={userLocation}
                  image={{ uri: newFormatAvatar }}
                  onPress={() => navigation.navigate("Profil")}
                />
              )}

              {scenariosData.map((data, i) => (
                <Marker
                  key={i}
                  coordinate={{
                    latitude: data.geolocalisation?.latitude ?? 48.866667,
                    longitude: data.geolocalisation?.longitude ?? 2.333333,
                  }}
                  image={gameMarker.scenario}
                  onPress={() => {
                    console.log("data", data.name, data._id);
                    setModalGameName(data.name);
                    setModalGameTheme(data.theme);
                    setModalGameDuration(data.duree);
                    setModalGameInfo(data.infoScenario);
                    setModalInfo(true);
                    setSelectedScenario(data._id);
                    const distance = getDistanceFromLatLonInMeters(
                      userLocation.latitude,
                      userLocation.longitude,
                      data.geolocalisation.latitude,
                      data.geolocalisation.longitude
                    );
                    setIsUserNear(distance <= PROXIMITY_THRESHOLD);
                  }}
                />
              ))}
            </MapView>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={recenterMapOnPinUser}>
            <FontAwesome name="map-marker" size={42} color="#85CAE4" />
          </TouchableOpacity>
        </View>

        {modalInfo && (
          <Modal visible={modalInfo} animationType="fade" transparent>
            <TouchableWithoutFeedback
              onPress={() => {
                setModalInfo(false);
                setModalExpanded(false);
              }}
            >
              <View style={styles.centeredView}>
                <Pressable
                  style={[
                    styles.modalView,
                    modalExpanded && styles.expandedModal,
                  ]}
                  onPress={() => !modalExpanded && setModalExpanded(true)}
                >
                  <Text style={styles.modalTitle}>{modalGameName}</Text>
                  <Text style={styles.modalTheme}>{modalGameTheme}</Text>
                  <Text style={styles.additionalInfo}>Durée : {modalGameDuration} min</Text>
                  {modalExpanded && (
                    <>
                      <Text style={styles.modalInfoText}>{modalGameInfo}</Text>
                      {isUserNear ? (
                        <TouchableOpacity
                          style={styles.startGameButton}
                          onPress={() =>
                            choosenScenario({
                              scenario: modalGameName,
                              scenarioID: selectedScenario,
                            })
                          }
                        >
                          <Text style={styles.startGameButtonText}>
                            Lancer l'aventure
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.textGoAventure}>
                          Rends-toi sur place pour commencer l'aventure.
                        </Text>
                      )}
                    </>
                  )}
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#85CAE4",
  },

  mapContainer2: {
    alignSelf: "center",
    height: "96%",
    width: "94%",
    borderRadius: 30,
    overflow: "hidden",
  },

  map: {
    flex: 1,
    height: "100%",
    width: "100%",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 60,
    right: 0,
    flex: 1,
    width: 64,
    height: 64,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond assombri derrière la modale
  },

  modalView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
    width: "80%",
    padding: 18,
    elevation: 3,
  },

  expandedModal: {},

  modalTitle: {
    fontFamily: "FugazOne-Regular.ttf",
    fontSize: 40,
    lineHeight: 46,
    color: "#009EBA",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  modalInfoText: {
    fontFamily: "Fustat-Regular.ttf",
    fontSize: 14,
    lineHeight: 20,
    color: "#636773",
    padding: 10,
    textAlign: "left",
  },

  modalTheme: {
    fontFamily: "Fustat-ExtraBold.ttf",
    fontSize: 14,
    lineHeight: 16,
    color: "#636773",
    textAlign: "left",
  },

  additionalInfo: {
    fontFamily: "Fustat-ExtraBold.ttf",
    fontSize: 14,
    lineHeight: 16,
    color: "#636773",
    textAlign: "left",
    marginBottom: 20
  },

  startGameButton: {
    width: "90%",
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF8527",
    padding: 10,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
    elevation: 3,
  },

  startGameButtonText: {
    fontFamily: "Fustat-ExtraBold.ttf",
    color: "white",
    fontSize: 18,
  },

  textGoAventure: {
    color: "#FF8527",
    fontFamily: "Fustat-ExtraBold.ttf",
    fontSize: 18,
    lineHeight: 20,
    textAlign: "center",
    padding: 10,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#85CAE4",
  },
  loaderText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  errorMessage: {
    fontSize: 20,
    color: "#FF6347", // Couleur rouge pour l'erreur
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "white",
  },
});
