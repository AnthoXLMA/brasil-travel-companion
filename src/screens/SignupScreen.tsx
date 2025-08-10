import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { signIn } from '../services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      // Rediriger ou afficher succès
    } catch (err) {
      setError('Erreur de connexion : ' + (err as Error).message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Se connecter" onPress={handleLogin} />
      {error && <Text>{error}</Text>}
    </View>
  );
}
