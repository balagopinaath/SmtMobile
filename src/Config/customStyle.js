import { StyleSheet, Appearance } from 'react-native';
import { customColors, customcustomColors, customFonts } from './helper';

const getTheme = () => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? 'dark' : 'light'
}

const customStyles = (theme) => {
    const colors = theme === 'dark' ? darkColors : lightColors;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: customColors.background,
            padding: 16,
        },
        title: {
            fontFamily: customFonts.plusJakartaSansBold,
            fontSize: 24,
            color: customColors.text,
            marginBottom: 8,
        },
        subtitle: {
            fontFamily: customFonts.plusJakartaSansMedium,
            fontSize: 18,
            color: customColors.text,
            marginBottom: 8,
        },
        text: {
            fontFamily: customFonts.plusJakartaSansRegular,
            fontSize: 16,
            color: customColors.text,
        },
    })
};

const lightColors = {
    background: customColors.background,
    text: customColors.text,
    primary: customColors.primary,
    white: customColors.white,
};

const darkColors = {
    background: customColors.black,
    text: customColors.white,
    primary: customColors.primary,
    white: customColors.white,
};

export default customStyles;
export { getTheme }