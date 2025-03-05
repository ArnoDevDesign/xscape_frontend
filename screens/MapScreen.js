import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {

    //images pointeurs
    const markers = {
        pinUser: require("../assets/pinUser.png"),
		pinGame: require("../assets/pinGame.png"),
		pinGameOff: require("../assets/pinGameOff.png")
    }

    // Référence à la carte
    const mapRef = useRef(null);

    //etat pour de la position de l'utilisateur
    const [userLocation, setUserLocation] = useState({
        latitude: 0,
        longitude: 0,
    });

    // localisation de l'utilisateur
    useEffect(() => {
        (async () => {
            console.log('here');
            const { status } = await Location.requestForegroundPermissionsAsync();
            console.log(status);
            // demande de permission pour la Geolocalisation
            if (status === 'granted') {
                console.log('here 2');
                // si autorisation alors on recupere la position
                
                Location.watchPositionAsync({ distanceInterval: 10 },
                    (loc) => {
                        console.log('here 3')
                        setUserLocation(loc.coords);
                        console.log(loc.coords);
                    });
            }
        })();
    }, []);

    // Fonction pour vérifier si l'utilisateur est hors du cadre
    const onRegionChangeComplete = (newRegion) => {
        const { latitude, longitude } = newRegion;
        const { latitude: userLatitude, longitude: userLongitude } = userLocation;
        const LATITUDE_DELTA = 0.0922;
        const LONGITUDE_DELTA = 0.0421;

        if (
            latitude < userLatitude - LATITUDE_DELTA / 2 ||
            latitude > userLatitude + LATITUDE_DELTA / 2 ||
            longitude < userLongitude - LONGITUDE_DELTA / 2 ||
            longitude > userLongitude + LONGITUDE_DELTA / 2
        ) {
            mapRef.current.animateToRegion({
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                mapType="terrain"
                style={styles.map}
                initialRegion={{
                    latitude: userLocation.latitude || 48.866667,
                    longitude: userLocation.longitude || 2.333333,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onRegionChangeComplete={onRegionChangeComplete}
            >
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="My position"
                        pinColor="red"
                        style={styles.userPin}
                    >
                        <Image source={markers.pinUser} style={styles.userPin} />
                    </Marker>
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    userPin: {
        width: 100,
        height: 100,
    },
});
