import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function MapScreen() {
  const [places, setPlaces] = useState([]);

  // Charger les lieux depuis Firestore
  useEffect(() => {
    const loadPlaces = async () => {
      const snapshot = await getDocs(collection(db, "places"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaces(data);
    };
    loadPlaces();
  }, []);

  // Générer le HTML pour Google Maps avec markers
  const googleMapsHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <style>
          #map { height: 100vh; width: 100vw; margin: 0; padding: 0; }
          html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; }
          #pac-input {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            padding: 8px 12px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 3px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 5;
          }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=VOTRE_CLE_API&libraries=places"></script>
        <script>
          function initMap() {
            const center = { lat: -22.971177, lng: -43.182543 };
            const map = new google.maps.Map(document.getElementById("map"), {
              zoom: 12,
              center: center,
            });

            const input = document.getElementById('pac-input');
            const autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (!place.geometry) return;
              if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
              } else {
                map.setCenter(place.geometry.location);
                map.setZoom(15);
              }
            });

            const placesData = ${JSON.stringify(places)};

            placesData.forEach(place => {
              const marker = new google.maps.Marker({
                position: { lat: place.lat, lng: place.lng },
                map: map,
                title: place.name,
              });

              const infoContent = \`
                <div>
                  <h3>\${place.name}</h3>
                  <p>\${place.description}</p>
                  <button onclick="window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'addToItinerary', placeId: '\${place.id}' }))">
                    Ajouter à l'itinéraire
                  </button>
                </div>
              \`;

              const infoWindow = new google.maps.InfoWindow({ content: infoContent });

              marker.addListener("click", () => {
                infoWindow.open(map, marker);
              });
            });
          }
        </script>
      </head>
      <body onload="initMap()">
        <input id="pac-input" type="text" placeholder="Rechercher un lieu" />
        <div id="map"></div>
      </body>
    </html>
  `;

  if (Platform.OS === "web") {
    return (
      <iframe
        src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyAftVkhjlH0aiTg4ciiJJaGj3ogX77hOi0&center=-22.971177,-43.182543&zoom=12`}
        style={{ flex: 1, width: "100%", height: "100vh", border: "none" }}
        allowFullScreen
      />
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: googleMapsHtml }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.action === "addToItinerary") {
            console.log("Lieu à ajouter :", data.placeId);
            // Ici tu peux déclencher un ajout Firestore dans l'itinéraire du user
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
