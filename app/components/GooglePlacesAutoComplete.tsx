import React from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_API_KEY = 'AIzaSyDYZqWNGimH-pfDx1JRCShDCzlo7ORNtLk';

export default function SearchPlace() {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Rechercher un lieu"
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' contient les infos sur le lieu sélectionné
          console.log(data, details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: 'fr',
          types: 'establishment', // ou '(cities)' pour uniquement les villes
        }}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
        }}
      />
    </View>
  );
}
