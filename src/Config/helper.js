import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFromFontAwesome from 'react-native-vector-icons/FontAwesome';

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
    black: "#000000",
    white: "#ffffff",
    text: "#050315",
    primary: "#2f27ce",
    secondary: "#dedcff",
    accent: "#433bff",
    background: "#fbfbfe",
}

export const customIcons = {
    mobileInput: <IconFromFontAwesome name="mobile-phone" size={25} color={customColors.accent} />,
    updateLocation: <IconFromFontAwesome name="check" size={20} color={customColors.accent} />,

    logout: <IconAntDesign name="logout" size={25} color={customColors.accent} />,
}