import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const googleMapsHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      <style>
        #map { height: 100vh; width: 100vw; margin: 0; padding: 0; }
        html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; }
      </style>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDYZqWNGimH-pfDx1JRCShDCzlo7ORNtLk&libraries=places"></script>
      <script>
        function initMap() {
          const iguazu = { lat: -25.6953, lng: -54.4367 };
          const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: iguazu,
          });
          new google.maps.Marker({
            position: iguazu,
            map: map,
            title: "Chutes d'Iguazu",
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
  if (Platform.OS === 'web') {
    return (
      <iframe
        src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyDYZqWNGimH-pfDx1JRCShDCzlo7ORNtLk&center=-25.6953,-54.4367&zoom=12`}
        style={{ flex: 1, width: '100%', height: '100vh', border: 'none' }}
        allowFullScreen
      />
    );
  }

  return (
    <View style={styles.container}>
      <WebView originWhitelist={['*']} source={{ html: googleMapsHtml }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
