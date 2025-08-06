import { useState, useRef, useEffect } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { formStyles, navigationStyles } from './styles';

const SERVERIP = 'ws://85.214.137.22';
const PORT = 4000;

/**
 * callbacks {}
 *  - on_success() (called after log-in validation with server)
 *  - on_return() (called after user voluntarily returns and state is cleared)
 *
 * elements [{}]
 *  - name (placeholder for input field)
 *  - type (password | email ...)
 *  - instruction (text field instruction string)
 */
const NFform = ({ callbacks, elements }) => {
  const [connected, setConnected] = useState(false);
  const [alt, setAlt] = useState(false); // variable for while loop

  const ws = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket(`${SERVERIP}:${PORT}`);

    ws.current.onopen = () => {
      setConnected(true);
    };

    ws.current.onmessage = e => {
      const msg = e.data;
      const string = msg.toString();
      const obj = JSON.parse(string);
      if (obj.success) callbacks.on_success();
    };

    ws.current.onclose = () => {
      setConnected(false);
      setTimeout(() => setAlt(!alt), 5000);
    };

    ws.current.onerror = e => {
      setConnected(false);
      console.log('ERROR');
      setTimeout(() => setAlt(!alt), 5000);
    };

    return () => {
      ws.current && ws.current.close();
    };
  }, [alt]);

  let waiting_for_response = false;

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
    if (!connected) return;
    waiting_for_response = true;
    ws.current.send(JSON.stringify(form_data));
  }
  4;
  function on_return() {
    if (waiting_for_response) return;
    set_form_data({});
    callbacks.on_return();
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
      <Button
        style={navigationStyles.return_button}
        title={'RETURN'}
        onPress={() => on_return()}
      />
    </View>
  );
};

export { NFform };
