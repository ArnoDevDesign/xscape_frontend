import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                Location.watchPositionAsync(
                    { distanceInterval: 10 },
                    (loc) => {
                        setLocation(loc.coords);
                        console.log(loc);
                    }
                );
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            {/* <SafeAreaView /> */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location?.latitude || 48.866667,
                    longitude: location?.longitude || 2.333333,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {location && (
                    <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
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
});
