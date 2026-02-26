import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors.js';

const styles = StyleSheet.create({
    header_main: {
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.headerBackground,
        paddingHorizontal: 15,
    },
    left_group: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    header_photo: {
        height: 60,
        width: 60,
        backgroundColor: colors.photoBackground,
        borderRadius: 30,
    },
    header_name: {
        fontSize: 18,
        fontWeight: 'bold',
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