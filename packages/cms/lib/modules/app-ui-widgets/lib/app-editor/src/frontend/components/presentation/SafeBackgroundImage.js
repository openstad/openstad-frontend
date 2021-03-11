import React from "react";
import {ImageBackground, View} from "react-native";

const SafeBackgroundImage = (props) => {

    console.log('props', props)

    return (props.backgroundImage ?
            <ImageBackground style={props.style} source={{
                uri: props.backgroundImage
            }}>
                <View style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#000',
                    opacity: 0.4
                }}/>
                {props.children}
            </ImageBackground> :
            <View style={props.style}> {props.children} </View>
    )
}

export default SafeBackgroundImage;
