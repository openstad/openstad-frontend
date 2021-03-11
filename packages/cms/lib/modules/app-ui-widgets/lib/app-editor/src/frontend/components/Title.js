import React, {useState} from "react";
import {Text, StyleSheet, View} from "react-native";

const styles = {
    titleTextContainer: {},
    titleText: {
        fontSize: 32,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10
    },
    h4: {}
};

const defaultStyles = {
    marginTop: 10,
    fontSize: 22,
}

const variantStyles = {
    h1: {
        fontSize: 30
    },
    h2: {
        fontSize: 25
    },
    h3: {
        fontSize: 20
    },
    h4: {
        fontSize: 15
    },
    upperTitle: {
        fontSize: 12,
        textTransform: 'uppercase',
        margin: 0
    }
}


const Title = (props) => {
    const variantStyle = props.variant && variantStyles[props.variant] ? variantStyles[props.variant] : {};
    let styles = defaultStyles;

    styles = {styles, ...variantStyle}
    styles = props.style ? {styles, ...props.style} : styles;

    console.log('props in Title variantStyles', variantStyles)

    return props.resource ? <ResourceTitle {...props} style={styles}/> : <StaticTitle  {...props} style={styles}/>;
}

const ResourceTitle = (props) => {
    return (
        <Text style={{...styles.titleText, ...props.style}}>
            {props.activeResource[props.keyTitle]}
        </Text>
    );
}

const StaticTitle = (props) => {

    return (
        <View>
            <Text style={{...styles.titleText, ...props.style}}>
                {props.title}
            </Text>
        </View>
    );
};


export default Title;
