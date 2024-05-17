import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import { customColors } from '../Config/helper';

const Accordion = ({ data, renderHeader, renderContent }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleAccordion = (index) => {
        if (expanded === index) {
            setExpanded(null);
        } else {
            setExpanded(index);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {data.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                    <TouchableOpacity onPress={() => toggleAccordion(index)}>
                        <View style={styles.headerContent}>
                            {renderHeader(item)}
                            <Icon
                                name={expanded === index ? 'upcircleo' : 'circledowno'}
                                size={20}
                                color={customColors.black}
                                style={styles.icon}
                            />
                        </View>
                    </TouchableOpacity>
                    {expanded === index && (
                        <View style={styles.contentContainer}>
                            {renderContent(item)}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    )
}

export default Accordion

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    itemContainer: {
        marginBottom: 10,
        backgroundColor: '#e0e0e0',
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
    },
    icon: {
        marginLeft: 10,
    },
})