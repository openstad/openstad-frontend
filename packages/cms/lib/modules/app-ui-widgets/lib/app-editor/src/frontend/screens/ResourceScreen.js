/* Layout elements */
import React, { Component, useEffect, useState } from "react";
import ComponentManager from '../ComponentManager';
import { View, Text } from "react-native";
import axios from 'axios';

const Loader = (props) => {
  return <Text> Loading... </Text>;
}

const ResourceScreen = (props) => {

    const { id } = props.route.params;

    const resourceType = props.resources.find((resource) => {
      return props.resource === resource.name;
    });

    const resourceId = parseInt(id, 10);
    const apiUrl = `${resourceType.apiBase}/${resourceType.apiPath}/${id}`;

    const [resource, setResource] = useState({item: [], isFetching: true});

    useEffect(() => {
      const fetchResource = async () => {
        try {
          setResource({item: resource.item, isFetching: true});

          if (props.localResources) {
            let foundResource = props.localResources.find((localResource) => {
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
          <Loader />
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
