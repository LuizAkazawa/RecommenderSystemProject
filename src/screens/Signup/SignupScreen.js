import { View, Text, TextInput, Button} from 'react-native';
import React, { useState } from 'react';

import { handleSignUp } from '../../services/api';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{ padding: 20 }}>
      <Text>Name:</Text>
      <TextInput 
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        value={name} 
        onChangeText={setName} 
      />
      <Text>Password:</Text>
      <TextInput 
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry
      />
      <Button title="Create Account" onPress={ () => handleSignUp(name, password, navigation)} />
    </View>
  );
};

export default SignUpScreen;