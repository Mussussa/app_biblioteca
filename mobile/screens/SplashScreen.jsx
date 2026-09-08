import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, StatusBar } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const carregarEIniciar = async () => {
      // Simula o tempo de carregamento da Splash (2.5 segundos)
      setTimeout(() => {
        // Redireciona sempre para a Home (MainTabs) permitindo acesso público
        navigation.replace('MainTabs');
      }, 2500);
    };

    carregarEIniciar();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Bloco Central */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/unipungue.webp')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.universityText}>UNIVERSIDADE PÚNGUÈ</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>I.J.bibliotecaApp</Text>
          <Text style={styles.subtitle}>Biblioteca Digital</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 12,
  },
  universityText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 6,
  },
});