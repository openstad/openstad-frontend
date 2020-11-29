/* Layout elements */
import React, { Component } from 'react';
import { ComponentManager } from '../ComponentManager';
import { View } from "react-native";

const Loader = (props) => {
  return <Text> Loading... </Text>;
}

const ResourceScreen = (props) {

  render() {
    const resourceType = props.resourceTypes.find((resourceType) => {
      return props.resource === resourceType.;
    });

    const resourceId = props.resourceId;

    const apiUrl = `${resourceType.apiBase}/${resourceType.apiPath}/${resourceId}`;

    const [resource, setResource] = useState({item: [], isFetching: false});

    useEffect(() => {
      const fetchResource = async () => {
        try {
          setResource({item: resources.item, isFetching: true});
          const response = await axios.get(apiUrl);
          setResource({item: response, isFetching: false});
        } catch (e) {
          console.log(e);
          setResource({item: resources.item, isFetching: false});
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
            components={props.components}
            resource={resource.item}
          />
        }
      </View>
    )
  }
}

export default ResourceScreen;
