import { db } from "@/config/firebase";
import { useRouter } from 'expo-router';
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import PlaceSearch from './PlaceSearch';
import RoutePlanner from './RoutePlanner';

interface Place {
  id?: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
}

export default function MapScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<null | Place>(null);

  const router = useRouter();

  // Charger les lieux depuis Firestore
  useEffect(() => {
    const loadPlaces = async () => {
      const snapshot = await getDocs(collection(db, "places"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Place, 'id'>) }));
      setPlaces(data);
    };
    loadPlaces();
  }, []);

  const handlePlaceSelected = (place: Place) => {
    setSelectedPlace(place);
    console.log("Place sélectionnée via recherche:", place);
  };

  const center = selectedPlace ? { lat: selectedPlace.lat, lng: selectedPlace.lng } : { lat: -22.971177, lng: -43.182543 };
  const zoom = selectedPlace ? 15 : 12;

  const onConfirmTrip = (selectedPlaces: Place[]) => {
    const tripData = encodeURIComponent(JSON.stringify(selectedPlaces));
    router.push(`/tripDetail/[tripId]?data=${tripData}`);
  };

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
                  <p>\${place.description || ''}</p>
                  <button onclick="window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'addToItinerary', place: place }))">
                    Ajouter à l'itinéraire
                  </button>
                </div>
              \`;

              const infoWindow = new google.maps.InfoWindow({ content: infoContent });
              marker.addListener("click", () => infoWindow.open(map, marker));
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
      <div style={{ maxWidth: 800, margin: "auto", padding: 16 }}>
        <PlaceSearch onPlaceSelected={handlePlaceSelected} />
        <iframe
          title="Google Map"
          src={`https://www.google.com/maps/embed/v1/view?key=TON_API_KEY&center=${center.lat},${center.lng}&zoom=${zoom}`}
          style={{ width: "100%", height: "60vh", border: "none" }}
          allowFullScreen
        />
        <RoutePlanner onConfirmTrip={onConfirmTrip} />
      </div>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: googleMapsHtml }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.action === "addToItinerary") {
              console.log("Lieu à ajouter :", data.place);
              // Ici tu peux stocker en state pour RoutePlanner
            }
          } catch (err) {
            console.error("Erreur parsing message WebView:", err);
          }
        }}
      />
      <RoutePlanner onConfirmTrip={onConfirmTrip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
