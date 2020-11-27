import React, { useEffect, useState } from "react";
import axios from "axios";
import { Text, StyleSheet } from "react-native";

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
  return <Text> Loading </Text>;
}

const CardItem = (props) => {
  const titleKey = props.titleKey ? props.titleKey : 'title';
  return <Text>  </Text>;
}

const ListItem = (props) => {
  const titleKey = props.titleKey ? props.titleKey : 'title';
  return <Text> {props.item[titleKey]} </Text>;
}

const displayTypes = {
  'list' => ListItem,
  'card' => CardItem
}

const DisplayItems = (props) => {
  return (
    <View>
    {props.items.map((item) => {
      <displayTypes[props.displayType] {...props} item={item} />
    })}
    </View>
  )
}

const ResourceOverview = (props) => {
  const resourceType = props.resourceTypes.find((resourceType) => {
    return props.resource === resourceType.;
  });

  const [resources, setResources] = useState({resources: [], isFetching: false});

  useEffect(() => {
    const fetchResources = async () => {
      try {
          setResources({items: resources.items, isFetching: true});
          const response = await axios.get(USER_SERVICE_URL);
          setResources({resources: response, isFetching: false});
      } catch (e) {
          console.log(e);
          setResources({users: data.resources, isFetching: false});
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
