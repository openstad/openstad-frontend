import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    fontFamily: "Cochin"
  },
  container: {
    fontFamily: "Cochin"
  }
});

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
  return <Text> {props.item[titleKey]} </Text>;
}

const displayTypes = {
  'list' : ListItem,
  'card' : CardItem
}

const DisplayItems = (props) => {
  const DisplayItem = displayTypes[props.displayType];

  return (
    <View>
    {props.items.map((item) => {
      return <DisplayItem {...props} item={item} />
    })}
    </View>
  )
}

const ResourceOverview = (props) => {
  const resourceType = props.resources.find((resource) => {
    return props.resource === resource.name;
  });

  const apiUrl = `${resourceType.apiBase}/${resourceType.apiPath}`;

  const [resources, setResources] = useState({items: [], isFetching: false});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setResources({items: resources.items, isFetching: true});
        const response = await axios.get(apiUrl);
        // if response key isset the items are found there, otherwise they are directly at the root of the response opbject
        const items = resourceType.responseKey ? response[resourceType.responseKey] : response;
        setResources({items: items, isFetching: false});
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
        <DisplayItems {...props} items={resources.items}  /> :
        (resources.isFetching ? <Loader /> : <NoResults />)
      }
    </View>
  );
};

const Overview = (props) => {
  return <ResourceOverview {...props} />;
}

export default Overview;
