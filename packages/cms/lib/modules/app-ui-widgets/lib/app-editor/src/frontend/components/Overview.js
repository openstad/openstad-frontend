import React, {useEffect, useState} from "react";
import axios from "axios";
import {ScrollView, View, Text, StyleSheet, ImageBackground, TouchableHighlight} from "react-native";
import {SafeBackgroundImage} from "./presentation";
import {Link} from '@react-navigation/native';
//import Carousel from 'react-native-snap-carousel';

/**
 * @Todo
 */


const styles = StyleSheet.create({
    container: {
        fontFamily: "Cochin"
    },

});

const cardStyles = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    height: 180,
    width: 100,
    borderRadius: 5,
    background: '#FFF'
}
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

    return <View style={cardStyles}>
        <Text>{props.item[titleKey]}</Text>
    </View>
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
        <>
            {props.items.map((item, i) => {
                return props.linkToScreen ? <TouchableHighlight
                    key={item.id} onPress={() => {
                    props.navigation.navigate(props.formatResourceScreenName(props.resource), {id: item.id})
                }} >
                    <DisplayItem {...props} item={item} />
                </TouchableHighlight> : <DisplayItem {...props} item={item} key={item.id} />
            })}
        </>
    )
}


const OverviewContainer = (props) => {
    return props.scroll === 'horizontal' ?
        <ScrollView horizontal style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
        }}>{props.children}</ScrollView>
        :
        <View>{props.children}</View>
 }

const ResourceOverview = (props) => {

    const resourceName = props.resource;

    //available resource schema contain the info on how to handle them
    const resourceSchema = props.resourceSchemas[resourceName];

    if (!resourceSchema) {
        throw new Error('Resource schema not found in overview for resource type: ', resourceName);
    }

    const apiUrl = `${resourceSchema.apiBase}/${resourceSchema.apiPath}`;

    const [resources, setResources] = useState({items: [], isFetching: false});


    useEffect(() => {
        const fetchResources = async () => {
            try {
                setResources({items: resources.items, isFetching: true});

                // if local the resources are loaded with the react app
                if (resourceSchema.local) {

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
        <OverviewContainer style={styles.container} {...props}>
            {resources.items ?
                <DisplayItems key={'resource-items-'+resourceName} {...props} items={resources.items}/> :
                (resources.isFetching ? <Loader/> : <NoResults/>)
            }
        </OverviewContainer>
    );
};

/*
/*                <FlatList
                    style={styles.container}
                    {...props}
                    data={resources.items}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item: rowData }) => {
                        return <DisplayItem item={rowData} key={'resource-items-'+resourceName} {...props} />
                    }}
                />

<Carousel
ref={(c) => { this._carousel = c; }}
data={props.items}
renderItem={({item, index}) => {
return <DisplayItem />
}}
/>
 */

const Overview = (props) => {
    return <ResourceOverview {...props} />
}

export default Overview;
