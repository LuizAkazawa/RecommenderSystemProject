import { Alert } from 'react-native';

//test connection with python (do some changes)
const connectionPython = async (endpoint, method="GET", data=null) => {
    try{
        const BASE_URL = 'http://localhost:8000';
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type' : 'application/json',
                },
            body : data ? JSON.stringify(data) : null,
            });
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    }catch(error){
        console.error("Connection failed", error);
        return null;
    }
};

//add music to python server memory
const addMusic = async (title, artist, duration) => {
  const newMusic = {
    title: title,
    artist: artist,
    duration: duration
  };
  const result = await connectionPython('music', 'POST', newMusic);

  if (result) {
    console.log("Success:", result);
  } else {
    console.log("Failed to save data");
  }
};

//keep login data and verify if account exists
const handleLogin = async (name, password, navigation) => {
    try {
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: name,
                password: password
            }),
        });
        console.log(response)
        if (response.ok) {
            navigation.navigate('Home', { username: name });
        } else {
            Alert.alert("Login Failed", "User not found or wrong password");
        }
    } catch (error) {
        console.error("Connection error", error);
        Alert.alert("Error", "Is the python server running?");
    }
};

//verify if it's possible to create account and keep in python server memory
const handleSignUp = async (name, password, navigation) => {
try {
    const response = await fetch('http://localhost:8000/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        name: name, 
        password: password 
    }),
    });

    if (response.ok) {
    Alert.alert("Success", "Account created! Please login.");
    navigation.navigate("LoginScreen");
    } else {
    Alert.alert("Error", "Could not create account");
    }
} catch (error) {
    console.error(error);
}
};

export { connectionPython, addMusic, handleLogin, handleSignUp };