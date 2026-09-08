import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Telas Reais
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import CatalogoScreen from './screens/CatalogoScreen';
import DetalhesObraScreen from './screens/DetalhesObraScreen';
import ReservarExemplarScreen from './screens/ReservarExemplarScreen';

// Placeholders mantidos para as telas que ainda serão desenvolvidas
import { TrabalhosScreen, PerfilScreen } from './screens/Placeholders';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Menu Inferior (Bottom Navigation Bar)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1e3a8a', // Azul UniPúnguè
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'InicioTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CatalogoTab') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'TrabalhosTab') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'PerfilTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="InicioTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Início' }} 
      />
      <Tab.Screen 
        name="CatalogoTab" 
        component={CatalogoScreen} 
        options={{ tabBarLabel: 'Catálogo' }} 
      />
      <Tab.Screen 
        name="TrabalhosTab" 
        component={TrabalhosScreen} 
        options={{ tabBarLabel: 'Trabalhos' }} 
      />
      <Tab.Screen 
        name="PerfilTab" 
        component={PerfilScreen} 
        options={{ tabBarLabel: 'Perfil' }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        {/* Rota inicial */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        
        {/* Rotas de Autenticação */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />

        {/* Home e navegação principal por Abas */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Detalhes da Obra */}
        <Stack.Screen name="DetalhesObra" component={DetalhesObraScreen} />

        {/* ROTA ADICIONADA: Processo de Reserva do Exemplar */}
        <Stack.Screen name="ReservarExemplar" component={ReservarExemplarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}