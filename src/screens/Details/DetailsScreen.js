import { useRef, useCallback } from 'react';
import { Text, View, Image, Button} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { addMusic } from '../../services/api.js';

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
        source={require('../../assets/images/closer_image.jpg')} 
        resizeMode='cover'
      />

      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="Add this Music" onPress={() => addMusic(item.title, item.id, 0)} />
    </View>
  );
}

export default DetailsScreen;