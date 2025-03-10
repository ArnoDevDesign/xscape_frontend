import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableWithoutFeedback } from "react-native";
{
  /*Ajout de cette importation pour le modal*/
}

export default function HomeScreen({ navigation }) {
  const userRedux = useSelector((state) => state.users.value);


  {/*console.log(userRedux.avatar);*/}

  const gameMarker = {
    scenario: require("../assets/pinGame2.png"),
  };

  const newFormatAvatar = userRedux.avatar.replace("/upload/","/upload/w_230,h_230,r_30/");
  {/*console.log(newFormatAvatar);*/}


  {/*Référence à la carte*/}
  const mapRef = useRef(null);


  {/*etat pour de la position de l'utilisateur*/}
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });


  {/*etat pour l'affichage de la modale*/}
  const [modalInfo, setModalInfo] = useState(false);
  const [modalExpanded, setModalExpanded] = useState(false);


  {/*localisation de l'utilisateur*/}
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      {/*demande de permission pour la Geolocalisation*/}
      if (status === "granted") {

        {/*si autorisation alors on recupere la position*/}
        Location.watchPositionAsync({ distanceInterval: 10 }, (loc) => {
          console.log("here 3");
          setUserLocation(loc.coords);
          console.log(loc.coords);
        });
      }
    })();
  }, []);

  const recenterMapOnPinUser = () => {
    const { latitude, longitude } = userLocation;
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      1000
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude || 48.866667,
          longitude: userLocation.longitude || 2.333333,
          latitudeDelta: 0.05,
          longitudeDelta: 0.0333,
        }}
      >
        {/*Marker pour la position de l'utilisateur*/}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            image={{ uri: newFormatAvatar }}
            onPress={() => navigation.navigate("Profil")}
          />
        )}

        {/*Marker pour la position du game*/}
        <Marker
          coordinate={{ latitude: 48.8795, longitude: 2.309 }}
          image={gameMarker.scenario}
          onPress={() => setModalInfo(true) }
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={recenterMapOnPinUser}>
          <FontAwesome name="map-marker" size={42} color="#58BBBF" />
        </TouchableOpacity>
      </View>

      {/* Modal info */}
      {modalInfo && (
        <Modal visible={modalInfo} animationType="fade" transparent>
          {/* Fermer la modale en cliquant en dehors */}
          <TouchableWithoutFeedback
            onPress={() => {
              setModalInfo(false); // Ferme la modale
              setModalExpanded(false); // Réinitialise l'état de "expanded" à false
            }}
          >
            <View style={styles.centeredView}>
              {/* Modale */}
              <Pressable
                style={[
                  styles.modalView,
                  modalExpanded && styles.expandedModal,
                ]}
                onPress={() => {
                    
                  // Agrandir la modale seulement si elle est actuellement dans l'état réduit
                  if (!modalExpanded) {
                    setModalExpanded(true); // Agrandit la modale si elle est réduite
                  }
                }}
              >
                <Text style={styles.modalTitle}>LA CAPSULE PERDUE</Text>
                <Text style={styles.modalInfo}>Durée estimée : 30 min.</Text>

                {/* Infos supplémentaires si la modale est agrandie */}
                {modalExpanded && (
                  <>
                    <Text style={styles.additionalInfo}>
                      Ce scénario vous plongera dans une quête palpitante.
                      Préparez-vous à une aventure inoubliable !
                    </Text>

                    {/*Bouton lancer l'aventure*/}
                    <TouchableOpacity
                      style={styles.startGameButton}
                      onPress={() => {
                        navigation.navigate("StartGame");
                      }}
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
    </View>
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
    borderRadius: 10,
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
    color: "#58BBBF",
  },

  modalInfo: {
    fontSize: 14,
    color: "#656565",
  },

  additionalInfo: {
    fontSize: 14,
    color: "#656565",
    textAlign: "left",
    padding: 10,
  },

  startGameButton: {
    backgroundColor: "#FF9100",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },

  startGameButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
