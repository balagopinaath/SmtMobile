import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;

const responsiveFontSize = (baseFontSize) => {
    const baseWidth = 375;
    return baseFontSize * (deviceWidth / baseWidth);
}

export const customFonts = {
    plusJakartaSansBold: "PlusJakartaSans-Bold",
    plusJakartaSansExtraBold: "PlusJakartaSans-ExtraBold",
    plusJakartaSansItalic: "PlusJakartaSans-Italic",
    plusJakartaSansLight: "PlusJakartaSans-Light",
    plusJakartaSansMedium: "PlusJakartaSans-Medium",
    plusJakartaSansRegular: "PlusJakartaSans-Regular",
    plusJakartaSansSemiBold: "PlusJakartaSans-SemiBold",
}

export const customColors = {
    light: {
        background: "#ffffff",
        primary: "#20c997",
        secondary: "#f5f5f5",
        accent: "#FF7043",
        surface: '#1E1E1E',
        textPrimary: "#212121",
        textSecondary: '#757575',
        black: "#000000",
        white: "#ffffff",
    },
    dark: {
        background: "#000000",
        primary: "#20c997",
        secondary: "#1E1E1E",
        accent: "#FF7043",
        surface: '#f5f5f5',
        textPrimary: "#ffffff",
        textSecondary: '#b0b0b0',
        black: "#000000",
        white: "#ffffff",
    },
}

export const typography = {
    h1: (colors) => ({
        fontFamily: customFonts.plusJakartaSansExtraBold,
        fontSize: responsiveFontSize(32),
        color: colors.textPrimary,
    }),
    h2: (colors) => ({
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: responsiveFontSize(28),
        color: colors.textPrimary,
    }),
    h3: (colors) => ({
        fontFamily: customFonts.plusJakartaSansSemiBold,
        fontSize: responsiveFontSize(24),
        color: colors.textPrimary,
    }),
    h4: (colors) => ({
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: responsiveFontSize(20),
        color: colors.textPrimary,
    }),
    h5: (colors) => ({
        fontFamily: customFonts.plusJakartaSansMedium,
        fontSize: responsiveFontSize(18),
        color: colors.textPrimary,
    }),
    h6: (colors) => ({
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: responsiveFontSize(16),
        color: colors.textPrimary,
    }),
    body1: (colors) => ({
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: responsiveFontSize(14),
        color: colors.textPrimary,
    }),
    body2: (colors) => ({
        fontFamily: customFonts.plusJakartaSansRegular,
        fontSize: responsiveFontSize(12),
        color: colors.textSecondary,
    }),
    button: (colors) => ({
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: responsiveFontSize(14),
        color: colors.white,
    }),
    caption: (colors) => ({
        fontFamily: customFonts.plusJakartaSansLight,
        fontSize: responsiveFontSize(12),
        color: colors.textSecondary,
    }),
    overline: (colors) => ({
        fontFamily: customFonts.plusJakartaSansLight,
        fontSize: responsiveFontSize(10),
        color: colors.textSecondary,
    }),
};