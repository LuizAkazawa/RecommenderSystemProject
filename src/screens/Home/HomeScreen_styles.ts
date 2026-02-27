import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors.js';

const styles = StyleSheet.create({
    header_main: {
        height: 100,
        paddingHorizontal: 15,
        paddingTop: 12,
        paddingBottom: 16,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    hamburger_button: {
        position: 'absolute',
        top: 50,
        right: 15,
    },
    hamburger_icon: {
        fontSize: 50,
        color: colors.textWhite,
        lineHeight: 32,
    },
    header_left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    header_photo: {
        height: 64,
        width: 64,
        backgroundColor: colors.photoBackground,
        borderRadius: 14,
    },
    header_name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textWhite,
    },
    gridContainer: {
        padding: 10,
    },
    logoView: {
        width: '50%',          
        padding: 10,        
    },
    musicName: {
        fontSize: 14,
        color: colors.text,
        marginTop: 6,
        textAlign: 'center',
    },
    musicLogo: {
        width: '100%',
        height: '100%',
    },
    gridItem: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.error,
    },
});

export default styles;
