import { useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { formStyles } from './styles';

const NFform = ({ callbacks, elements }) => {
  const [form_data, set_form_data] = useState(() => {
    const init_state = {};
    elements.forEach(element => {
      let init_value = {};
      init_value['value'] = '';
      init_value['type'] = element.type;
      if (element.type === 'password') init_value['secure'] = true;
      init_state[element.name] = init_value;
    });
    return init_state;
  });
  function on_input(field, string) {
    set_form_data(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value: string,
      },
    }));
  }
  function on_submit() {
    /**
     * TODO server requests
     *      validity checks
     */
    throw new Error('on_submit not implemented');
  }
  return (
    <View style={formStyles.form_border}>
      {elements.map((elem, index) => (
        <View key={index}>
          <Text style={formStyles.form_instruction_text}>
            {elem.instruction}
          </Text>
          <TextInput
            style={formStyles.input_border}
            placeholder={`ENTER ${elem.name}`}
            value={form_data[elem.name].value}
            onChangeText={text => on_input(elem.name, text)}
            secureTextEntry={form_data[elem.name].secure}
          />
        </View>
      ))}
      <Button title={'SUBMIT'} onPress={() => on_submit()} />
    </View>
  );
};

export { NFform };
