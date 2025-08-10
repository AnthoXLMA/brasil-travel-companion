import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <>
      {/* tes inputs et bouton connexion ici */}

      <Button title="S’inscrire" onPress={() => navigation.navigate('Signup')} />
    </>
  );
}
