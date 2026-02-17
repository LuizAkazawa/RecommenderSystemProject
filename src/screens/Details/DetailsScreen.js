import { useRef, useCallback, useState, useEffect } from 'react';
import { Text, View, Image, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import { addMusic } from '../../services/api.js';

const DetailsScreen = ({ route, navigation }) => {
    const { item, user } = route.params;
    const timingPlaying = useRef(timePlayed);

    const[timePlayed, setTimePlayed] = useState(0);

    const [position, setPosition] = useState(0); 
    const [isPlaying, setIsPlaying] = useState(true); // To pause/play

    const durationSec = item.total_duration / 1000; 

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Timer Logic
    //I probably need to optimize this
    useEffect(() => {
        let interval = null;

        if (isPlaying && position < durationSec) {
            interval = setInterval(() => {
                setPosition((prev) => prev + 1);
                setTimePlayed((prev) => prev + 1)
            }, 1000); // Update every 1 second
        } else if (position >= durationSec) {
            setIsPlaying(false);
            setPosition(durationSec);
        }

        return () => {clearInterval(interval);} // Cleanup on unmount/pause
    }, [isPlaying, position]);

    timingPlaying.current = timePlayed;
    useFocusEffect(
      useCallback(() => {
        console.log(item.track_id);
        console.log(timingPlaying);
        
        return () => {
          const finalTime = (timingPlaying.current > item.total_duration) ? item.total_duration : timingPlaying.current
          addMusic(user, item.track_id, finalTime * 1000, item.total_duration);
        }
      }, [item.track_id])
    )

    // Handle User Dragging Slider
    const onSlide = (value) => {
        setPosition(value);
    };
    

    //Need to change this style and put into the folder ./styles
    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>{item.track_name}</Text>
      <Text>ID: {item.track_id}</Text>
      
      <Image 
        style={{ width: 200, height: 200, marginVertical: 20, borderRadius: 10 }} 
        source={require('../../assets/images/closer_image.jpg')} 
        resizeMode='cover'
      />

      <View style={{ width: '80%', marginTop: 20 }}>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={durationSec}
            value={position}
            onValueChange={onSlide} // Called when user drags
            minimumTrackTintColor="#1EB1FC"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1EB1FC"
          />
          <View style={styles.timeContainer}>
              <Text>{formatTime(position)}</Text>
              <Text>{formatTime(durationSec)}</Text>
          </View>
      </View>


      <View style={styles.buttonContainer}>
          <Button 
            title={isPlaying ? "Pause" : "Play"} 
            onPress={() => setIsPlaying(!isPlaying)} 
          />
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff'
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    id: { marginBottom: 20 },
    image: { width: 200, height: 200, borderRadius: 10 },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    buttonContainer: { marginTop: 30, gap: 10 }
});

export default DetailsScreen;