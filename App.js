import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import MapScreen from './screens/MapScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import AvatarScreen from './screens/AvatarScreen'
import ScenarioScreen from './screens/ScenarioScreen'
import StartGameScreen from './screens/StartGameScreen'
import EndScreen from './screens/EndScreen'
import IngameScreen1 from './screens/IngameScreen'
import IngameScreen3 from './screens/IngameScreen3'
import IngameScreen2 from './screens/IngameScreen2'

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import users from './reducers/users';

import { View, Text } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();//Ignore all log notifications

SplashScreen.preventAutoHideAsync();


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({ reducer: { users } });

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName = '';

//           if (route.name === 'Map') {
//             iconName = 'location-arrow';
//           }
//           else if (route.name === 'Avatar') {
//             iconName = 'child';
//           }
//           else if (route.name === 'Profil') {
//             iconName = 'user';
//           }
//           else if (route.name === 'Scenario') {
//             iconName = 'user';
//           }
//           else if (route.name === 'StartGame') {
//             iconName = 'user';
//           }
//           else if (route.name === 'End') {
//             iconName = 'user';
//           }
//           else if (route.name === 'Ingame') {
//             iconName = 'user';
//           }
//           else if (route.name === 'Ingame2') {
//             iconName = 'user';
//           }
//           else if (route.name === 'Ingame3') {
//             iconName = 'user';
//           }

//           return <FontAwesome name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#ec6e5b',
//         tabBarInactiveTintColor: '#335561',
//         headerShown: false,
//       })}>
//       <Tab.Screen name="Map" component={MapScreen} />
//       {/* <Tab.Screen name="Profil" component={ProfileScreen} /> */}
//       {/* <Tab.Screen name="Avatar" component={AvatarScreen} /> */}
//       {/* <Tab.Screen name="Scenario" component={ScenarioScreen} /> */}
//       {/* <Tab.Screen name="StartGame" component={StartGameScreen} /> */}
//       {/* <Tab.Screen name="End" component={EndScreen} /> */}
//       {/* <Tab.Screen name="Ingame1" component={ingameScreen1} /> */}
//       {/* <Tab.Screen name="Ingame2" component={IngameScreen2} /> */}
//       {/* <Tab.Screen name="Ingame3" component={IngameScreen3} /> */}
//     </Tab.Navigator>
//   );
// };

export default function App() {

  const [loaded] = useFonts({
    "Fustat-Bold.ttf": require("./assets/fonts/Fustat-Bold.ttf"),
    "Fustat-ExtraBold.ttf": require("./assets/fonts/Fustat-ExtraBold.ttf"),
    "Fustat-ExtraLight.ttf": require("./assets/fonts/Fustat-ExtraLight.ttf"),
    "Fustat-Light.ttf": require("./assets/fonts/Fustat-Light.ttf"),
    "Fustat-Medium.ttf": require("./assets/fonts/Fustat-Medium.ttf"),
    "Fustat-Regular.ttf": require("./assets/fonts/Fustat-Regular.ttf"),
    "Fustat-SemiBold.ttf": require("./assets/fonts/Fustat-SemiBold.ttf"),
    "Homenaje-Regular.ttf": require("./assets/fonts/Homenaje-Regular.ttf"),
    "PressStart2P-Regular.ttf": require("./assets/fonts/PressStart2P-Regular.ttf"),
    "Righteous-Regular.ttf": require("./assets/fonts/Righteous-Regular.ttf"),
    "Goldman-Regular.ttf": require("./assets/fonts/Goldman-Regular.ttf"),
    "Goldman-Bold.ttf": require("./assets/fonts/Goldman-Bold.ttf"),
    "FugazOne-Regular.ttf": require("./assets/fonts/FugazOne-Regular.ttf"),
    "Exo2-SemiBold.ttf": require("./assets/fonts/Exo2-SemiBold.ttf"),
    "Exo2-Regular.ttf": require("./assets/fonts/Exo2-Regular.ttf"),
    "Exo2-Medium.ttf": require("./assets/fonts/Exo2-Medium.ttf"),
    "Exo2-ExtraBold.ttf": require("./assets/fonts/Exo2-ExtraBold.ttf"),
    "Exo2-Bold.ttf": require("./assets/fonts/Exo2-Bold.ttf"),
    "Exo2-Black.ttf": require("./assets/fonts/Exo2-Black.ttf"),
    "Doto-Regular.ttf": require("./assets/fonts/Doto-Regular.ttf"),
    "Doto-Bold.ttf": require("./assets/fonts/Doto-Bold.ttf"),
    "Doto-Black.ttf": require("./assets/fonts/Doto-Black.ttf"),
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

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={LoginScreen} />
          <Stack.Screen name="Avatar" component={AvatarScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Scenario" component={ScenarioScreen} />
          <Stack.Screen name="StartGame" component={StartGameScreen} />
          <Stack.Screen name="End" component={EndScreen} />
          <Stack.Screen name="Ingame1" component={IngameScreen1} />
          <Stack.Screen name="Ingame2" component={IngameScreen2} />
          <Stack.Screen name="Ingame3" component={IngameScreen3} />
          <Stack.Screen name="Profil" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
{/* <Stack.Screen name="TabNavigator" component={TabNavigator} /> */ }
