/* Layout elements */
import React, {Component, useEffect, useState} from "react";
import ComponentManager from '../ComponentManager';
import {View, Text} from "react-native";
import axios from 'axios';

const Loader = (props) => {
    return <Text> Loading... </Text>;
}

const ResourceScreen = (props) => {

    const {id} = props.route.params;

    const resourceSchema = props.resourceSchemas[props.resource];

    if (!resourceSchema) {
        throw new Error('Resource schema not found in Resource screen for resource type: ', props.resource);
    }

    const resourceId = parseInt(id, 10);
    const apiUrl = `${resourceSchema.apiBase}/${resourceSchema.apiPath}/${id}`;

    const [resource, setResource] = useState({item: [], isFetching: true});

    useEffect(() => {
        const fetchResource = async () => {
            try {
                setResource({item: resource.item, isFetching: true});

                if (resourceSchema.local) {

                    const foundResource = props.resourcesData.find((localResource) => {
                        return localResource.id === resourceId;
                    });

                    setResource({item: foundResource, isFetching: false});
                } else {
                    const response = await axios.get(apiUrl);
                    setResource({item: response, isFetching: false});
                }

            } catch (e) {
                setResource({item: resource.item, isFetching: false});
            }
        };
        fetchResource();
    }, []);

    return (
        <View style={{
            flex: 1
        }}>
            {resource.isFetching ?
                <Loader/>
                :
                <ComponentManager
                    {...props}
                    activeResource={resource.item}
                />
            }
        </View>
    )
}


/*


 */
export default ResourceScreen;
