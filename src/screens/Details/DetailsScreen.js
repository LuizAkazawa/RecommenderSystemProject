import { useRef, useCallback, useState, useEffect } from 'react';
import { Text, View, Image, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import styles from './DetailsScreen.styles';

import { addMusic } from '../../services/api.js';

const DetailsScreen = ({ route, navigation }) => {
    const { item, user } = route.params;

    const [position, setPosition] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true); // To pause/play
 
    const positionRef = useRef(position);
    positionRef.current = position;

    const durationSec = item.duration_ms / 1000;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        let interval = null;

        if (isPlaying && position < durationSec) {
            interval = setInterval(() => {
                setPosition((prev) => prev + 1);
            }, 1000); // Update every 1 second
        } else if (position >= durationSec) {
            setIsPlaying(false);
            setPosition(durationSec);
        }

        return () => { clearInterval(interval); }; 
    }, [isPlaying, position, durationSec]);  // Cleanup on unmount/pause

    useFocusEffect(
        useCallback(() => {
            //console.log(item.track_id);

            return () => {
                const playedMs = positionRef.current * 1000;
                const finalTime = Math.min(playedMs + 1000, item.duration_ms);
                addMusic(user, item.track_id, finalTime, item.duration_ms);
            };
        }, [item.track_id])
    );

    const onSlide = (value) => {
        setPosition(value);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{item.track_name}</Text>
            <Text style={styles.trackId}>ID: {item.track_id}</Text>

            <Image
                style={styles.albumArt}
                source={require('../../assets/images/closer_image.jpg')}
                resizeMode='cover'
            />

            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={durationSec}
                    value={position}
                    onValueChange={onSlide}
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
};

export default DetailsScreen;