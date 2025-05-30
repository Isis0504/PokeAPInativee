import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Login from './src/componentes/Login';
import Registro from './src/componentes/Registro';
import Home from './src/componentes/Home';
import Original from './src/componentes/Original';
import Perfil from './src/componentes/Perfil';
import Logout from './src/componentes/Logout';
import Detalle from './src/componentes/Detalle'; // Asegúrate de crear este componente

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Creamos un stack navigator para las pantallas de películas
function PeliculasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePeliculas" component={Home} />
      <Stack.Screen name="Detalle" component={Detalle} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        {usuario ? (
          <>
            <Tab.Screen 
              name="Home" 
              component={PeliculasStack} // Usamos el stack de películas aquí
            />
            <Tab.Screen name="Original" component={Original} />
            <Tab.Screen name="Perfil" component={Perfil} />
            <Tab.Screen name="Logout" component={Logout} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Registro" component={Registro} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}