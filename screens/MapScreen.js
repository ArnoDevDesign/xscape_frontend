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

// Map
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

// Icones
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Etats & Redux
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserToStore } from "../reducers/users";

// URL back
const URL = process.env.EXPO_PUBLIC_BACKEND_URL;



export default function MapScreen({ navigation }) {

  // État pour la position de l'utilisateur
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });

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

  // États pour gérer les transitions et erreurs
  const [isLoading, setIsLoading] = useState(true);
  const [geolocationError, setGeolocationError] = useState(false);
  const [fadeIn, setFadeIn] = useState(new Animated.Value(0)); // Contrôle l'animation de fondu


  // Récupération des données de l'utilisateur
  const userRedux = useSelector((state) => state.users.value);

  // Initialisation du dispatch pour envoyé les données
  const dispatch = useDispatch();

  // modification de l'url de l'image de l'avatar pour la mettre au bon format afin de l'utiliser comme marker
  const newFormatAvatar = userRedux.avatar.includes("/upload/")
    ? userRedux.avatar.replace("/upload/", "/upload/w_230,h_230,r_30/")
    : userRedux.avatar;

  // Personnalisation du Marker jeux
  const gameMarker = {
    scenario: require("../assets/pinGameok.png"),
  };

  // Référence pour la carte
  const mapRef = useRef(null);

  //////////////////////////////////////////////////////A REVOIR ////////////////////////////////////////////
  // revoir l envoi d§es donnees redux en passant par addusertostore 

  // Fonction pour choisir le scénario
  const choosenScenario = (data) => {
    dispatch(
      addUserToStore({
        scenario: data.scenario, // Met à jour la clé scenario
        scenarioID: data.scenarioID, // Met à jour la clé scenarioID
      })
    );
    setModalInfo(false); // Ferme la modale
    setPassageaujeu(true); // Passe à la page du jeu
  };

  useEffect(() => {
    if (passageaujeu) {
      navigation.navigate("Scenario");
    }
  }, [passageaujeu])




  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Géolocalisation de l'utilisateur
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      // Demande de permission pour la géolocalisation
      if (status === "granted") {
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
  }, []);

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

    fetchScenarios();
  }, []);

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
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#009EBA" />
      <Text style={styles.loaderText}>Chargement...</Text>
    </View>
  ) : geolocationError ? (
    <View style={styles.loaderContainer}>
      <Text style={styles.errorMessage}>Accès à la géolocalisation refusé</Text>
    </View>
  ) : (
    <Animated.View style={[styles.mapContainer, { opacity: fadeIn }]}>
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
        {/* Marker pour la position de l'utilisateur */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            image={{ uri: newFormatAvatar }}
            onPress={() => navigation.navigate("Profil")}
          />
        )}

        {/* Markers des jeux */}
        {scenariosData.map((data, i) => (
          <Marker
            key={i}
            coordinate={{
              latitude: data.geolocalisation?.latitude ?? 48.866667,
              longitude: data.geolocalisation?.longitude ?? 2.333333,
            }}
            image={gameMarker.scenario}
            onPress={() => {
              console.log("data", data.name, data._id,);
              setModalGameName(data.name);
              setModalGameTheme(data.theme);
              setModalGameDuration(data.duree);
              setModalGameInfo(data.infoScenario);
              setModalInfo(true);
              setSelectedScenario(data._id);
            }}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={recenterMapOnPinUser}>
          <FontAwesome name="map-marker" size={42} color="#009EBA" />
        </TouchableOpacity>
      </View>

      {/* Modal info */}
      {modalInfo && (
        <Modal visible={modalInfo} animationType="fade" transparent>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalInfo(false); // Ferme la modale
              setModalExpanded(false); // Réinitialise l'état de "expanded" à false
            }}
          >
            <View style={styles.centeredView}>
              <Pressable
                style={[
                  styles.modalView,
                  modalExpanded && styles.expandedModal,
                ]}
                onPress={() => {
                  if (!modalExpanded) {
                    setModalExpanded(true); // Agrandit la modale si elle est réduite
                  }
                }}
              >
                <Text style={styles.modalTitle}>{modalGameName}</Text>
                <Text style={styles.modalInfo}>
                  Thème de l'aventure : {modalGameTheme}
                </Text>
                <Text style={styles.modalTheme}>
                  Durée estimée : {modalGameDuration} min.
                </Text>

                {modalExpanded && (
                  <>
                    <Text style={styles.additionalInfo}>{modalGameInfo}</Text>

                    <TouchableOpacity
                      style={styles.startGameButton}
                      onPress={() => choosenScenario({ scenario: modalGameName, scenarioID: selectedScenario })}

                    >
                      <Text style={styles.startGameButtonText}>
                        Commencer l'aventure
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#58BBBF",
  },

  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond assombri derrière la modale
  },

  modalView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
    height: 100,
    elevation: 3,
  },

  expandedModal: {
    height: 400, // Taille agrandie lorsqu'on clique dessus
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#009EBA",
  },

  modalInfo: {
    fontSize: 14,
    color: "#636773",
  },

  modalTheme: {
    fontSize: 14,
    color: "#636773",
    textAlign: "left",
  },

  additionalInfo: {
    fontSize: 14,
    color: "#636773",
    textAlign: "left",
    padding: 10,
  },

  startGameButton: {
    width: "80%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF8527",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },

  startGameButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#58BBBF",
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
