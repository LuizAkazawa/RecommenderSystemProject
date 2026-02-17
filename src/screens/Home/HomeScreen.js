import { FlatList, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';

import styles from '../../styles/globalStyles.ts';

import { connectionPython } from '../../services/api.js';


//HomeScreen to see all the music options
const HomeScreen = ({ route, navigation }) => {
  const { username } = route.params;

  const [musicData, setMusicData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () =>{
    try{
      const response = await connectionPython('tracks');
      setMusicData(response);
    }catch(error) {
      console.error("Error fetching music: ", error)
    }finally{
      setIsLoading(false);
    }
  };

  //renders all musics
  const renderItem = ({ item }) => (
      <View style={styles.logoView}>
      <TouchableOpacity 
          style={styles.gridItem}
          onPress={() => navigation.navigate('Details', { item: item, user: username })}
      >
          <Image style={styles.musicLogo} source={require('../../assets/images/closer_image.jpg')} resizeMode='cover' />
      </TouchableOpacity>
      <Text style={styles.musicName}>{item.track_name}</Text>
      </View>
  );

  return (
  <View style={{ flex: 1, backgroundColor: '#eee' }}>
    <View style={styles.header_main}>
      <View style={styles.left_group}>
        <Image style={styles.header_photo} source={require('../../assets/images/closer_image.jpg')} resizeMode='cover'/>
        <Text style={styles.header_name}> { username } </Text>
      </View>
      <TouchableOpacity>
        <Text>OPTIONS</Text>
      </TouchableOpacity>
    </View>


    {/*need to think about using the name of the music instead of logo/image*/}
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <ActivityIndicator size='large' color='#0000ff'/>
      ) : (
        <FlatList
          data={musicData}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={item => item.track_id.toString()}
          contentContainerStyle={styles.gridContainer}
        />
      )}
    </View>
  </View>
);
}


export default HomeScreen;