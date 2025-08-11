import React, { useEffect, useRef } from "react";

interface Place {
  name: string;
  location: google.maps.LatLngLiteral;
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

export default function PlaceSearch({ onPlaceSelected }: { onPlaceSelected: (place: Place) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Charger le script Google Maps et attendre qu'il soit prêt
  useEffect(() => {
    if (window.google) {
      // Si google est déjà chargé, on peut init autocomplete
      initAutocomplete();
    } else {
      // Sinon on crée une fonction globale pour init
      window.initMap = () => {
        initAutocomplete();
      };
      // Charger le script Google Maps avec callback=initMap
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDYZqWNGimH-pfDx1JRCShDCzlo7ORNtLk&libraries=places&callback=initMap`;
      script.async = true;
      document.head.appendChild(script);
    }

    function initAutocomplete() {
      if (!inputRef.current) return;
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["establishment", "geocode"],
        componentRestrictions: { country: "br" },
      });
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place || !place.geometry || !place.geometry.location) return;

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        onPlaceSelected({
          name: place.name || place.formatted_address || "Lieu inconnu",
          location,
        });

        if (inputRef.current) inputRef.current.value = "";
      });
    }
  }, [onPlaceSelected]);

  return <input type="text" ref={inputRef} placeholder="Rechercher un lieu" style={{ width: "100%", padding: 8 }} />;
}
