import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header_main: {
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'grey',
        paddingHorizontal: 15,
  },
   left_group : {
        flexDirection: 'row',
        alignItems: 'center',
   },
    header_photo: {
        height: 60 ,
        width: 60,
        backgroundColor: 'black',
        borderRadius: 30,
  },
    header_name: {
        fontSize: 18,
        fontWeight: 'bold',
  },

    gridContainer: {
        padding: 10,

  },

    logoView:{
        flex: 1,
        aspectRatio: 1,
        margin: 12,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',

  },

    musicName:{
        fontSize: 20,
        color: 'black',
        },

    musicLogo: {
        width: '100%',
        height: '100%',
        },

    gridItem: {
        flex: 1,
        overflow: 'hidden',
        width: '90%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
  },
    itemText: {
        fontSize: 24,
        fontWeight: 600,
        color: 'red',
  },


});

export default styles;