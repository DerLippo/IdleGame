import { useState, useRef, useEffect } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { formStyles, navigationStyles } from './styles';

const SERVERIP = 'ws://85.214.137.22'
const PORT = 4000

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

  const ws = useRef(null);
  useEffect(() => {
    ws.current = new WebSocket(`${SERVERIP}:${PORT}`);

    ws.current.onopen = () => {
      ws.current.send('Hallo vom Handy!');
    };

    ws.current.onmessage = e => {
      console.log('Server sagt:', e.data);
    };

    ws.current.onclose = () => {
      console.log('Verbindung geschlossen');
    };

    ws.current.onerror = e => {
      console.log('Fehler:', e.message);
    };

    return () => {
      ws.current && ws.current.close();
    };
  }, []);

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
    waiting_for_response = true;
    console.log("SENDING");
    ws.send("KEKW");
    /**
     * TODO server requests
     *      validity checks
     */
    throw new Error('on_submit not implemented');
  }

  function on_return() {
    if(waiting_for_response) return;
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
      <Button style={navigationStyles.return_button} title={'RETURN'} onPress={() => on_return()} />
    </View>
  );
};

export { NFform };
