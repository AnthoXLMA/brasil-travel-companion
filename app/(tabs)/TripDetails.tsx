import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Place {
  name: string;
  location: google.maps.LatLngLiteral;
}

interface Attraction {
  place_id: string;
  name: string;
  vicinity?: string;
}

interface LocationState {
  places: Place[];
  attractions: Record<number, Attraction[]>;
}

export default function TripDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | undefined;

  if (!state || !state.places || state.places.length === 0) {
    return (
      <div>
        <h2>Détails du séjour</h2>
        <p>Aucune donnée de séjour reçue.</p>
        <button onClick={() => navigate(-1)}>Retour</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Détails du séjour</h2>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {state.places.map((place, i) => (
          <li key={i} style={{ marginBottom: 20 }}>
            <strong>{place.name}</strong>
            <div style={{ marginLeft: 20 }}>
              {state.attractions[i] === undefined && <em>Chargement des attractions...</em>}
              {state.attractions[i] && state.attractions[i].length === 0 && (
                <em>Aucune attraction trouvée à proximité.</em>
              )}
              {state.attractions[i] && state.attractions[i].length > 0 && (
                <ul>
                  {state.attractions[i].map((attr) => (
                    <li key={attr.place_id}>
                      {attr.name} {attr.vicinity ? `- ${attr.vicinity}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Modifier l’itinéraire</button>
    </div>
  );
}
