import { View, Button, TextInput } from 'react-native';

import { components_e, parsec } from './component_parser.js';

/**
 * tree: the tree to be generated
 * form_data: the form's useState data
 * on_form_input: the form's useState mutator
 */
export const NFform = ({ tree, form_data, on_form_input }) => {

  /**
   * implement parsing for types not supported by imported function parsec()
   */
  function parse_c(element, key) {
    switch(element.type) {
      case components_e.TEXTINPUT: 
        return <TextInput 
          key={key}
          style={element.style || ''}
          placeholder={element.placeholder || ''}
          value={form_data[element.name]?.value || ''}
          onChangeText={text => on_form_input(element.name, text)}
          secureTextEntry={element.secure || false}
        />

      case components_e.BUTTON:
        return <Button 
          key={key}
          style={element.style || ''}
          title={element.text || ''}
          onPress={() => element.callback()}
        />

      default: return parsec(element, key)
    }
  }

  let key = 0;
  return <View>{tree.map(element => parse_c(element, key++))}</View>
}