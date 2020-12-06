/* Layout elements */
import React, { Component, useEffect, useState } from "react";
import ComponentManager from '../ComponentManager';
import { View, Text } from "react-native";
import axios from 'axios';

const Loader = (props) => {
  return <Text> Loading... </Text>;
}

const ResourceScreen = (props) => {

    console.log('ResourceScreen props', props)

    const { id } = props.route.params;

    const resourceType = props.resources.find((resource) => {
      return props.resource === resource.name;
    });

    const resourceId = props.resourceId;

    const apiUrl = `${resourceType.apiBase}/${resourceType.apiPath}/${id}`;

    const [resource, setResource] = useState({item: [], isFetching: false});

    useEffect(() => {
      const fetchResource = async () => {
        try {
          setResource({item: resource.item, isFetching: true});
          const response = await axios.get(apiUrl);
          setResource({item: response, isFetching: false});
        } catch (e) {
          console.log(e);
          setResource({item: resource.item, isFetching: false});
        }
      };
      fetchResource();
    }, []);

    return (
      <View>
        {resource.isFetching ?
          <Loader />
        :
          <ComponentManager
            {...props}
            resource={resource.item}
          />
        }
      </View>
    )
}

export default ResourceScreen;
