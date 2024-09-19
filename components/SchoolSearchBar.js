import React, { Component } from 'react';
import { TextInput, View, Text, FlatList } from 'react-native';

const DATA = [
 { id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba', title: 'First Item' },
 { id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63', title: 'Second Item' },
 { id: '58694a0f-3da1-471f-bd96-145571e29d72', title: 'Third Item' },
 { id: '58694a0f-3da1-471f-bd96-145571e29d73', title: 'Fourth Item' },
 { id: '58694a0f-3da1-471f-bd96-145571e29d74', title: 'Fifth Item' },
 { id: '58694a0f-3da1-471f-bd96-145571e29d75', title: 'Sixth Item' },
];

class SchoolSearchBar extends Component {
 constructor(props) {
    super(props);
    this.state = {
      input: '',
      suggestions: [],
    };
 }

 handleInputChange = (text) => {
    this.setState({ input: text });
    this.findSuggestions(text);
 };

 findSuggestions = (input) => {
    const filteredData = DATA.filter((item) => {
      return item.title.toLowerCase().includes(input.toLowerCase());
    });
    this.setState({ suggestions: filteredData.slice(0, 2) });
 };

 render() {
    return (
      <View style={{ padding: 10 }}>
        <FlatList
        contentContainerStyle={{position:'absolute',bottom:10}}
          data={this.state.suggestions}
          renderItem={({ item }) => <Text>{item.title}</Text>}
          keyExtractor={(item) => item.id}
        />
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={this.handleInputChange}
          value={this.state.input}
        />
        
      </View>
    );
 }
}

export default SchoolSearchBar;