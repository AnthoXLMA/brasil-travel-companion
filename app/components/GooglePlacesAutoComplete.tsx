// /app/components/GooglePlacesAutocomplete.tsx

import React from 'react';
import { StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_PLACES_API_KEY = 'AIzaSyDYZqWNGimH-pfDx1JRCShDCzlo7ORNtLkAIzaSyBkyUIdhc9SbUQoNyduAniBOh48V-fhD4I'; // Mets ta clé API ici

export default function GooglePlacesAutocompleteComponent({ onPlaceSelected }) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Rechercher un lieu"
      fetchDetails={true}
      onPress={(data, details = null) => {
        // data: info basique, details: coordonnées etc.
        if (onPlaceSelected) {
          onPlaceSelected(details);
        }
      }}
      query={{
        key: GOOGLE_PLACES_API_KEY,
        language: 'fr',
        types: 'establishment',
      }}
      styles={{
        container: styles.container,
        textInput: styles.textInput,
      }}
      debounce={400}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    position: 'absolute',
    top: 10,
    width: '90%',
    alignSelf: 'center',
    zIndex: 1000, // pour que ce soit au-dessus de la carte
  },
  textInput: {
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
