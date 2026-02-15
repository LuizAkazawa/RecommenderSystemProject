import React, { useState, useEffect } from 'react';
import { FlatList, TextInput, SafeAreaView, Text, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles from './styles/globalStyles.ts'


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

const renderItem = ({ item }) => (
    <View style={styles.logoView}>
      <TouchableOpacity onPress = {() => addMusic (item.title, item.id, 50)} style={styles.gridItem}>
        <Image style ={styles.musicLogo} source={require('./images/closer_image.jpg')} resizeMode='cover'/>
      </TouchableOpacity>
      <Text style={styles.musicName}>{item.title}</Text>
  </View>
);


const App = () => {
    const [serverData, setServerData] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            const result = await connectionPython('');
            if(result){
                setServerData(result);
                }
            };
            loadData();
        }, []);

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{flex: 1}} >

            <View style={styles.header_main}>
                <View style={styles.left_group}>
                    <View style={styles.header_photo}>
                    </View>
                    <Text style={styles.header_name}> USER NAME </Text>
                </View>
                <TouchableOpacity>
                    <Text>OPTIONS</Text>
                </TouchableOpacity>
            </View>



            <View style={{ padding: 10, backgroundColor: '#eee', margin: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Server Response:</Text>
                <Text>
                    {serverData
                        ? JSON.stringify(serverData, null, 2)
                        : "Loading..."
                    }
                </Text>
            </View>
            <View style= {{flex: 1}}>
              <FlatList
                data={DATA}
                numColumns={2}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle = {styles.gridContainer}
              />
              </View>


        </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;