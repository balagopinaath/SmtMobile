import { StyleSheet, View, TouchableOpacity, ScrollView, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import { customColors } from '../Config/helper';

const Accordion = ({ data, renderHeader, renderContent }) => {
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const [expanded, setExpanded] = useState(false);

    const toggleAccordion = (index) => {
        if (expanded === index) {
            setExpanded(null);
        } else {
            setExpanded(index);
        }
    };

    return (
        <ScrollView style={styles(colors).container}>
            {data.map((item, index) => (
                <View key={index} style={styles(colors).itemContainer}>
                    <TouchableOpacity onPress={() => toggleAccordion(index)}>
                        <View style={styles(colors).headerContent}>
                            {renderHeader(item, index)}
                            <Icon
                                name={expanded === index ? 'upcircleo' : 'circledowno'}
                                size={20}
                                color={colors.black}
                                style={styles(colors).icon}
                            />
                        </View>
                    </TouchableOpacity>
                    {expanded === index && (
                        <View style={styles(colors).contentContainer}>
                            {renderContent(item)}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    )
}

export default Accordion

const styles = (colors) => StyleSheet.create({
    container: {
        padding: 10,
    },
    itemContainer: {
        marginBottom: 10,
        backgroundColor: colors.secondary,
        borderRadius: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    contentContainer: {
        padding: 10,
        backgroundColor: colors.background,
    },
    icon: {
        marginLeft: 10,
        // color: colors.white,
    },
})