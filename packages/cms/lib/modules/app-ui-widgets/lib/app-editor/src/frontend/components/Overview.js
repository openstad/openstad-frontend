import React, {useEffect, useState} from "react";
import axios from "axios";
import {View, Text, StyleSheet, ImageBackground, TouchableHighlight} from "react-native";
import {SafeBackgroundImage} from "./presentation";
import {Link} from '@react-navigation/native';

/**
 * @Todo
 */


const styles = StyleSheet.create({
    container: {
        fontFamily: "Cochin"
    }
});

const defaultListItemStylesOuter = {
    marginBottom: 8
}

const defaultListItemStylesInner = {
    padding: 5,
    minHeight: 80,
}

const NoResults = (props) => {
    return <Text> No results </Text>;
}

const Loader = (props) => {
    return <Text> Loading... </Text>;
}

const CardItem = (props) => {
    const titleKey = props.titleKey ? props.titleKey : 'title';

    return <Text> {props.item[titleKey]}  </Text>;
}

const ListItem = (props) => {
    const titleKey = props.titleKey ? props.titleKey : 'title';
    const innerStyles = {...defaultListItemStylesInner, ...(props.styles || {})}
    let backgroundImage = props.backgroundImageKey && props.item[props.backgroundImageKey] ? props.item[props.backgroundImageKey] : (props.defaultBackgroundImage ? props.defaultBackgroundImage : false);

    // in case backgroundImage is an array grab first image
    backgroundImage = backgroundImage.constructor === Array ? backgroundImage[0] : backgroundImage;

    return (
        <View style={defaultListItemStylesOuter}>
            <SafeBackgroundImage backgroundImage={backgroundImage}>
                <Text style={innerStyles}>
                    {props.item[titleKey]}
                </Text>
            </SafeBackgroundImage>
        </View>
    );
    ;
}

const displayTypes = {
    'list': ListItem,
    'card': CardItem
}
//  <Link to="/game/1" style={{display: 'flex'}}>
//</Link>

const DisplayItems = (props) => {
    const DisplayItem = props.displayType ? displayTypes[props.displayType] : displayTypes['list'];

    return (
        <View>
            {props.items.map((item, i) => {
                return (
                    <TouchableHighlight onPress={() => props.navigation.navigate(props.resource, {id: item.id})}>
                        <DisplayItem {...props} item={item} key={i}/>
                    </TouchableHighlight>
                )
            })}
        </View>
    )
}

const ResourceOverview = (props) => {

    const resourceName = props.resource;

    console.log('props', props)
    console.log('resourceName', resourceName)
    console.log('resourceSchemas', props.resourceSchemas)

    //available resource schema contain the info on how to handle them
    const resourceSchema = props.resourceSchemas[resourceName];
    console.log('resourceSchema',resourceSchema)

    if (!resourceSchema) {
        throw new Error('Resource schema not found in overview for resource type: ', resourceName);
    }

    console.log('props', props);

    const apiUrl = `${resourceSchema.apiBase}/${resourceSchema.apiPath}`;

    const [resources, setResources] = useState({items: [], isFetching: false});


    useEffect(() => {
        const fetchResources = async () => {
            try {
                setResources({items: resources.items, isFetching: true});

                // if local the resources are loaded with the react app
                if (resourceSchema.local) {
                    console.log('props.resourcesData', props.resourcesData)
                    const resourceData = props.resourcesData.find(resource => {
                        return resource.name === resourceName;
                    });

                    //
                    setResources({items: resourceData.items, isFetching: false});
                } else {
                    const response = await axios.get(apiUrl);
                    const json = response.data;

                    // if response key isset the items are found there, otherwise they are directly at the root of the response object
                    // for instance {[]} vs {meta: [], rows: []}
                    const items = resourceSchema.responseKey ? json[resourceSchema.responseKey] : json;
                    setResources({items: items, isFetching: false});
                }

            } catch (e) {
                console.log(e);
                setResources({items: resources.items, isFetching: false});
            }
        };
        fetchResources();
    }, []);

    return (
        <View style={styles.container}>
            {resources.items ?
                <DisplayItems {...props} items={resources.items}/> :
                (resources.isFetching ? <Loader/> : <NoResults/>)
            }
        </View>
    );
};

const Overview = (props) => {
    return <ResourceOverview {...props} />;
}

export default Overview;
