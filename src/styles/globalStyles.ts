import { StyleSheet } from 'react-native';
import { colors } from './colors.js';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: colors.background,
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
        borderColor: colors.border,
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
        color: colors.error,
        marginBottom: 10,
        marginLeft: 5,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        color: colors.primary,
        marginBottom: 20,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: colors.textWhite,
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signUp: {
        color: colors.text,
    },
    signUpLink: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});

export default styles;