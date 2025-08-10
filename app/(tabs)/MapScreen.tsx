import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import PlaceSearch from './PlaceSearch';


export default function MapScreen() {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState<null | { name: string; location: { lat: number; lng: number } }>(null);

  // Charger les lieux depuis Firestore
  useEffect(() => {
    const loadPlaces = async () => {
      const snapshot = await getDocs(collection(db, "places"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaces(data);
    };
    loadPlaces();
  }, []);

  // Handler pour place sélectionnée dans PlaceSearch (web)
  const handlePlaceSelected = (place: { name: string; location: { lat: number; lng: number } }) => {
    setSelectedPlace(place);
    console.log("Place sélectionnée via recherche:", place);
    // Ici tu peux aussi ajouter le lieu à Firestore ou modifier l’itinéraire
  };

  // Construire l’HTML Google Maps avec markers et centrer sur selectedPlace si défini
  const center = selectedPlace ? selectedPlace.location : { lat: -22.971177, lng: -43.182543 };
  const zoom = selectedPlace ? 15 : 12;

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
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDYZqWNGimH-pfDx1JRCShDCzlo7ORNtLk&libraries=places"></script>
        <script>
          function initMap() {
            const center = { lat: ${center.lat}, lng: ${center.lng} };
            const map = new google.maps.Map(document.getElementById("map"), {
              zoom: ${zoom},
              center: center,
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
        <div id="map"></div>
      </body>
    </html>
  `;

  if (Platform.OS === "web") {
    return (
      <div style={{ maxWidth: 600, margin: "auto", padding: 16 }}>
        <PlaceSearch onPlaceSelected={handlePlaceSelected} />
        <iframe
          title="Google Map"
          src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyDYZqWNGimH-pfDx1JRCShDCzlo7ORNtLk&center=${center.lat},${center.lng}&zoom=${zoom}`}
          style={{ width: "100%", height: "80vh", border: "none" }}
          allowFullScreen
        />
      </div>
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
            // Ajout Firestore ici
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
