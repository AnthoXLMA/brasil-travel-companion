import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import PlaceSearch from "./PlaceSearch";


interface Place {
  name: string;
  location: { lat: number; lng: number };
}

interface Attraction {
  place_id: string;
  name: string;
  vicinity?: string;
}

export default function RoutePlanner() {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [attractions, setAttractions] = useState<Record<number, Attraction[]>>({});
  const router = useRouter();

  const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

  const fetchAttractions = async (place: Place, index: number) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${place.location.lat},${place.location.lng}&radius=1500&type=tourist_attraction&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.results) {
        setAttractions((prev) => ({
          ...prev,
          [index]: data.results.map((r: any) => ({
            place_id: r.place_id,
            name: r.name,
            vicinity: r.vicinity
          }))
        }));
      }
    } catch (err) {
      console.error("Erreur fetchAttractions", err);
    }
  };

  const addPlace = (place: Place) => {
    setSelectedPlaces((prev) => {
      const exists = prev.some((p) => p.name === place.name);
      if (!exists) {
        const newList = [...prev, place];
        fetchAttractions(place, newList.length - 1);
        return newList;
      }
      return prev;
    });
  };

  const removePlace = (index: number) => {
    setSelectedPlaces((prev) => prev.filter((_, i) => i !== index));
    setAttractions((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const handleValidateTrip = () => {
    if (selectedPlaces.length === 0) {
      Alert.alert("Ajoutez au moins une étape avant de valider.");
      return;
    }
    router.push({
      pathname: "/trip-details",
      params: {
        places: JSON.stringify(selectedPlaces),
        attractions: JSON.stringify(attractions)
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Planificateur d’itinéraire</Text>

      {/* Recherche */}
      <PlaceSearch onPlaceSelected={addPlace} />

      {/* Carte */}
      {selectedPlaces.length > 0 && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: selectedPlaces[0].location.lat,
            longitude: selectedPlaces[0].location.lng,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
        >
          {selectedPlaces.map((place, i) => (
            <Marker
              key={i}
              coordinate={{
                latitude: place.location.lat,
                longitude: place.location.lng
              }}
              title={place.name}
            />
          ))}

          {selectedPlaces.length > 1 && (
            <Polyline
              coordinates={selectedPlaces.map((p) => ({
                latitude: p.location.lat,
                longitude: p.location.lng
              }))}
              strokeColor="#FF0000"
              strokeWidth={3}
            />
          )}
        </MapView>
      )}

      {/* Liste des étapes */}
      {selectedPlaces.map((place, i) => (
        <View key={i} style={styles.placeItem}>
          <Text style={styles.placeName}>{place.name}</Text>
          <TouchableOpacity onPress={() => removePlace(i)}>
            <Text style={styles.removeBtn}>Supprimer</Text>
          </TouchableOpacity>

          {attractions[i] ? (
            attractions[i].map((attr) => (
              <Text key={attr.place_id} style={styles.attraction}>
                • {attr.name} {attr.vicinity ? `- ${attr.vicinity}` : ""}
              </Text>
            ))
          ) : (
            <Text style={styles.loading}>Chargement des attractions...</Text>
          )}
        </View>
      ))}

      <Button title="Valider le séjour" onPress={handleValidateTrip} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  map: { width: Dimensions.get("window").width - 32, height: 250, marginBottom: 20 },
  placeItem: { marginBottom: 20 },
  placeName: { fontSize: 16, fontWeight: "bold" },
  removeBtn: { color: "red", marginTop: 4 },
  attraction: { marginLeft: 12, color: "#555" },
  loading: { marginLeft: 12, fontStyle: "italic" }
});
