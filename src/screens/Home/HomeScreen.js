import { FlatList, Text, View, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './HomeScreen_styles.ts';
import { colors } from '../../styles/colors.js';
import MusicCover from '../../components/MusicCover';
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
            <MusicCover trackName={item.track_name} />
        </TouchableOpacity>
        <Text style={styles.musicName} numberOfLines={2} ellipsizeMode='tail'>
            {item.track_name.toString()} - {item.genre.toString()}
        </Text>
      </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundGrey }}>
      <LinearGradient
        colors={['#007BFF', '#0040A0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header_main}
      >
        <TouchableOpacity style={styles.hamburger_button}>
          <Text style={styles.hamburger_icon}>≡</Text>
        </TouchableOpacity>

        <View style={styles.header_left}>
          <MusicCover style ={styles.header_photo} trackName={username} />
          <Text style={styles.header_name}>{username}</Text>
        </View>
      </LinearGradient>


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
                  colors={[colors.primary]} 
                  tintColor={colors.primary}  
                />
              }
            />
          )}
        </View>
      </View>
);
}


export default HomeScreen;