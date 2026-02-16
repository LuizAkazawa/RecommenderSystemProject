import { StyleSheet } from 'react-native';

//still need to change this file !!!
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



container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#007BFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUp: {
    color: '#333',
  },
  signUpLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },



});

export default styles;