import React, { useEffect, useState } from 'react';
import { Dimensions, PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: -25.6953, // Coordonnées d’Iguazu
    longitude: -54.4367,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Optionnel : demander la permission de localisation (Android)
  useEffect(() => {
    async function requestLocationPermission() {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show nearby destinations.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
        }
      }
    }
    requestLocationPermission();
  }, []);

  // Exemple de markers
  const destinations = [
    {
      id: 1,
      title: 'Chutes d’Iguazu',
      coordinate: { latitude: -25.6953, longitude: -54.4367 },
    },
    {
      id: 2,
      title: 'Rio de Janeiro',
      coordinate: { latitude: -22.9068, longitude: -43.1729 },
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
      >
        {destinations.map(dest => (
          <Marker
            key={dest.id}
            coordinate={dest.coordinate}
            title={dest.title}
          />
        ))}
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
