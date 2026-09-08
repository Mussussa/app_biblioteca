import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Importação nomeada entre chaves {} para bater exatamente com a declaração "export function TrabalhosScreen"
import { TrabalhosScreen as TrabalhosComponent } from './TrabalhosScreen';
import {PerfilScreen } from './PerfilScreen'
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

export function PerfilScreen() {
  return (
    <View style={styles.center}>
      <PerfilScreen />
    </View>
  );
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