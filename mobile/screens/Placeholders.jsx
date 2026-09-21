import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrabalhosScreen as TrabalhosComponent } from './TrabalhosScreen';
import { PerfilScreen as PerfilComponent } from './PerfilScreen';

export function CatalogoScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>05. CATÁLOGO DE LIVROS</Text>
    </View>
  );
}

export function TrabalhosScreen() {
  return <TrabalhosComponent />;
}

export function PerfilScreen({ navigation }) {
  return <PerfilComponent navigation={navigation} />;
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#ffffff' 
  },
  text: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0f172a' 
  }
});