import { FlatList, Text, View, TouchableOpacity, Image } from 'react-native';

import styles from '../../styles/globalStyles.ts';

import { connectionPython } from '../../services/api.js';

// need to change this and use dynamic data (recommender system)
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

//HomeScreen to see all the music options
const HomeScreen = ({ route, navigation }) => {
  const { username } = route.params;
  //renders all musics
  const renderItem = ({ item }) => (
      <View style={styles.logoView}>
      <TouchableOpacity 
          style={styles.gridItem}

          onPress={() => navigation.navigate('Details', { item: item })}
      >
          <Image style={styles.musicLogo} source={require('../../assets/images/closer_image.jpg')} resizeMode='cover' />
      </TouchableOpacity>
      <Text style={styles.musicName}>{item.title}</Text>
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


export default HomeScreen;