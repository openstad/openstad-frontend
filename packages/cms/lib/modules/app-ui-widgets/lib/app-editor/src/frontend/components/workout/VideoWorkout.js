import React  from "react";
import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import { Video, AVPlaybackStatus } from 'expo-av';


const { width, height } = Dimensions.get('window');

console.log('width, height', width, height)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
        alignSelf: 'center',
        width: '100%',
        //height: width
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

/*
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />

                       <Video source={{uri: "background"}}   // Can be a URL or a local file.
                   ref={(ref) => {
                       this.player = ref
                   }}                                      // Store reference
                   onBuffer={this.onBuffer}                // Callback when remote video is buffering
                   onError={(e)=>{
                       console.log('e', e)
                   }}               // Callback when video cannot be loaded
                   style={styles.backgroundVideo}
            />
            <View style={styles.buttons}>
                <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                />
            </View>
 */

const VideoWorkout = (props) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    return (
        <View style={styles.container}>

            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
        </View>
    )
}

export default VideoWorkout;
