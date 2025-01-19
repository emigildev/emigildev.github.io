// Reglas de seguridad de Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función para verificar rol de usuario
    function getUserRole(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role;
    }
    
    // Reglas para la colección de vuelos
    match /flights/{flightId} {
      allow read: if request.auth != null; // Todos los usuarios autenticados pueden leer
      allow create, update, delete: if 
        getUserRole(request.auth.uid) in ['supervisor', 'coordinador']; // Solo supervisores y coordinadores pueden modificar
    }
    
    // Reglas para la colección de usuarios
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if getUserRole(request.auth.uid) == 'supervisor';
    }
  }
}

// Estructura de documento de usuario
{
  "uid": "string",
  "email": "string",
  "role": "string", // 'supervisor', 'coordinador', o 'agente'
  "name": "string",
  "createdAt": "timestamp"
}

// Estructura de documento de vuelo
{
  "arrivalFlight": {
    "flightNumber": "string",
    "registration": "string", // matrícula
    "origin": "string",
    "estimatedArrival": "timestamp",
    "platformPosition": "string",
    "specialServices": [{
      "type": "string",
      "quantity": "number"
    }],
    "connectingPassengers": [{
      "connectionFlight": "string",
      "passengerCount": "number"
    }]
  },
  "departureFlight": {
    "destination": "string",
    "departureTime": "timestamp",
    "businessPassengers": "number",
    "economyPassengers": "number",
    "specialServices": [{
      "type": "string",
      "quantity": "number"
    }],
    "boardingGate": "string",
    "crewChange": "boolean",
    "assignedAgents": ["string"] // array de IDs de usuarios
  },
  "status": "string",
  "lastUpdated": "timestamp",
  "lastUpdatedBy": "string" // ID del usuario que realizó la última actualización
}
