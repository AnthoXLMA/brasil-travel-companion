import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../../src/assets/images/rio.jpg')} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Brasil Travel Companion</Text>
        <Text style={styles.subtitle}>Découvrez le Brésil avec Iguazur Réceptif</Text>

        <TouchableOpacity 
          style={styles.buttonPrimary} 
          onPress={() => router.push('/explore')}
        >
          <Text style={styles.buttonText}>Explorer</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonSecondary} 
          onPress={() => router.push('/(auth)/signup')}

        >
          <Text style={styles.buttonTextSecondary}>Créer un compte</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonLink} 
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.linkText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 40,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonPrimary: {
    backgroundColor: '#1DB954', // vert Brésil
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  buttonSecondary: {
    borderColor: '#1DB954',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: '#1DB954',
    fontWeight: '700',
    fontSize: 18,
  },
  buttonLink: {
    marginTop: 10,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
