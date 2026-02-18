import { FlatList, Text, View, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';

import styles from '../../styles/globalStyles.ts';

import { connectionPython } from '../../services/api.js';


//HomeScreen to see all the music options
const HomeScreen = ({ route, navigation }) => {
  const { username, userID } = route.params;

  const [musicData, setMusicData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);


  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTracks();
  }, [userID]);

  const fetchTracks = async () =>{
    try{
      const response = await connectionPython(`recommend/${userID}`);
      //console.log(response);

      if (response && response.recommendations) {
          setMusicData(response.recommendations);
      }

    }catch(error) {
      console.error("Error fetching music: ", error)
    }finally{
      setIsLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);   
    await fetchTracks();   
    setRefreshing(false);  
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
      <Text style={styles.musicName}>{item.track_name.toString()} - {item.genre.toString()}</Text>
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
              keyExtractor={(item, index) => item.track_id ? item.track_id.toString() : index.toString()} 
              contentContainerStyle={styles.gridContainer}
              
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  colors={['#0000ff']} 
                  tintColor="#0000ff"  
                />
              }
            />
          )}
        </View>
      </View>
);
}


export default HomeScreen;