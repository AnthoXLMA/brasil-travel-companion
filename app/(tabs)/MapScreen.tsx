import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import GooglePlacesAutocompleteComponent from '../components/GooglePlacesAutoComplete';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBkyUIdhc9SbUQoNyduAniBOh48V-fhD4I';

const googleMapsHtml = (lat, lng) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      <style>
        #map { height: 100vh; width: 100vw; margin: 0; padding: 0; }
        html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; }
      </style>
      <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places"></script>
      <script>
        function initMap() {
          const center = { lat: ${lat}, lng: ${lng} };
          const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: center,
          });
          new google.maps.Marker({
            position: center,
            map: map,
            title: "Lieu sélectionné",
          });
        }
      </script>
    </head>
    <body onload="initMap()">
      <div id="map"></div>
    </body>
  </html>
`;

export default function MapScreen() {
  // État pour stocker la position sélectionnée par l'utilisateur
  const [location, setLocation] = useState({ lat: -25.6953, lng: -54.4367 }); // Iguazu par défaut

  const handlePlaceSelected = (details) => {
    if (details && details.geometry && details.geometry.location) {
      setLocation({
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
      });
    }
  };

  if (Platform.OS === 'web') {
    return (
      <>
        <GooglePlacesAutocompleteComponent onPlaceSelected={handlePlaceSelected} />
        <iframe
          src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${location.lat},${location.lng}&zoom=12`}
          style={{ flex: 1, width: '100%', height: '90vh', border: 'none' }}
          allowFullScreen
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <GooglePlacesAutocompleteComponent onPlaceSelected={handlePlaceSelected} />
      <WebView
        originWhitelist={['*']}
        source={{ html: googleMapsHtml(location.lat, location.lng) }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
