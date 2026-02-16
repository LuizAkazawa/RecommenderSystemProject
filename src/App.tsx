import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlatList, Text, View, TouchableOpacity, Image, Button, Alert, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as yup from 'yup';
import styles from './styles/globalStyles.ts'


const Stack = createNativeStackNavigator();

const DATA = [
  { id: '1', title: 'Music 1' },
  { id: '2', title: 'Music 2' },
  { id: '3', title: 'Music 3' },
  { id: '4', title: 'Music 4' },
  { id: '5', title: 'Music 5' },
  { id: '6', title: 'Music 6' },
  { id: '7', title: 'Music 7' },
  { id: '8', title: 'Music 8' },
  { id: '9', title: 'Music 9' },
  { id: '10', title: 'Music 10' },
  { id: '11', title: 'Music 11' },
  { id: '12', title: 'Music 12' },
];


//Refactor components!!!!
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

//Screen with music details
const DetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const startTime = useRef(null);

    //execute when screen appears (when item.id changes)
    useFocusEffect(
      useCallback(() => {
        startTime.current = Date.now();

        return () => {
          const endTime = Date.now();
          if(startTime.current){
            const duration = (endTime - startTime.current) / 1000;
            console.log(duration)
            addMusic(item.title, item.id, duration)
          }    
        };

      }, [item.id])
    );
    //Need to change this style and put into the folder ./styles
    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>{item.title}</Text>
      <Text>ID: {item.id}</Text>
      
      <Image 
        style={{ width: 200, height: 200, marginVertical: 20, borderRadius: 10 }} 
        source={require('./images/closer_image.jpg')} 
        resizeMode='cover'
      />

      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="Add this Music" onPress={() => addMusic(item.title, item.id, 0)} />
    </View>
  );
}


//HomeScreen to see all the music options
const HomeScreen = ({ navigation }) => {
    const [serverData, setServerData] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            const result = await connectionPython('music', 'GET');
            if(result){
                setServerData(result);
                }
            };
            loadData();
        }, []);

    //renders all musics
    const renderItem = ({ item }) => (
        <View style={styles.logoView}>
        <TouchableOpacity 
            style={styles.gridItem}

            onPress={() => navigation.navigate('Details', { item: item })}
        >
            <Image style={styles.musicLogo} source={require('./images/closer_image.jpg')} resizeMode='cover' />
        </TouchableOpacity>
        <Text style={styles.musicName}>{item.title}</Text>
        </View>
    );

    return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <View style={styles.header_main}>
        <View style={styles.left_group}>
          <View style={styles.header_photo}></View>
          <Text style={styles.header_name}> USER NAME </Text>
        </View>
        <TouchableOpacity>
          <Text>OPTIONS</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 10, backgroundColor: '#eee', margin: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>Server Response:</Text>
        <Text>
          {serverData ? JSON.stringify(serverData, null, 2) : "Loading..."}
        </Text>
      </View>

      {/*need to think about using the name of the music instead of logo/image*/}
      <View style={{ flex: 1 }}>
        <FlatList
          data={DATA}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </View>
  );

}

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Details" 
            component={DetailsScreen} 
            options={{ title: 'Music Details' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;