import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import des screens
// import GameScreen from './screens/GameScreen';
import MapScreen from './screens/MapScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import AvatarScreen from './screens/AvatarScreen'
import ScenarioScreen from './screens/ScenarioScreen'
import StartGameScreen from './screens/StartGameScreen'
import EndScreen from './screens/EndScreen'
import IngameScreen from './screens/IngameScreen'
import Ingame3Screen from './screens/Ingame3Screen'
import IngameScreen2 from './screens/IngameScreen2'

// Import Redux
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import users from './reducers/users';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({ reducer: { users } });

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Map') {
            iconName = 'location-arrow';
          }
          else if (route.name === 'Avatar') {
            iconName = 'child';
          }
          else if (route.name === 'Profil') {
            iconName = 'user';
          }
          else if (route.name === 'Scenario') {
            iconName = 'user';
          }
          else if (route.name === 'StartGame') {
            iconName = 'user';
          }
          else if (route.name === 'End') {
            iconName = 'user';
          }
          else if (route.name === 'Ingame') {
            iconName = 'user';
          }
          else if (route.name === 'Ingame2') {
            iconName = 'user';
          }
          else if (route.name === 'Ingame3') {
            iconName = 'user';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ec6e5b',
        tabBarInactiveTintColor: '#335561',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
      <Tab.Screen name="Avatar" component={AvatarScreen} />
      <Tab.Screen name="Scenario" component={ScenarioScreen} />
      <Tab.Screen name="StartGame" component={StartGameScreen} />
      <Tab.Screen name="End" component={EndScreen} />
      <Tab.Screen name="Ingame" component={IngameScreen} />
      <Tab.Screen name="Ingame2" component={IngameScreen2} />
      <Tab.Screen name="Ingame3" component={Ingame3Screen} />


      {/* <Tab.Screen name="Game" component={GameScreen} /> */}
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          <Stack.Screen name="Home" component={LoginScreen} />
          <Stack.Screen name="Avatar" component={AvatarScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          {/* <Stack.Screen name="Scenario" component={SCenarioScreen} />
          <Stack.Screen name="StartGame" component={StartGameScreen} />
          <Stack.Screen name="End" component={EndScreen} /> */}
          {/* <Stack.Screen name="InGame" component={IngameScreen} /> */}
          {/* <Stack.Screen name="InGame2" component={IngameScreen2} /> */}

          {/* <Stack.Screen name="InGame3" component={IngameScreen3} /> */}

          <Stack.Screen name="Profil" component={ProfileScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
