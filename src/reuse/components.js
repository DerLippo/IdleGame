import { useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';

export const components_e = {
  TEXT: 0,
  CONDITIONALTEXT: 3,
  TEXTINPUT: 1,
  BUTTON: 2,
};

export function parsec(element, key)
{
  switch(element.type) {
    case components_e.TEXT: 
      return <Text key={key} style={element.style || ''}>{element.text}</Text>;

    case components_e.CONDITIONALTEXT: 
      if(element.enabled)
        return <Text key={key} style={element.style || ''}>{element.text}</Text>;
      // fallthrough
    default: return null;
  }
}

export const NFform = ({ tree, form_data, on_form_input }) => {

  // const [form_data, set_form_data] = useState(() => {
  //   const init_state = {};

  //   tree.forEach(element => {
  //     if(element.type !== components_e.TEXTINPUT) return;

  //     let init_value = {};
  //     init_value['value'] = '';
  //     init_value['inputtype'] = element.inputtype;

  //     init_state[element.name] = init_value;
  //   });

  //   return init_state;
  // });

  // function on_input(field, string) {
  //   set_form_data(prev => ({
  //     ...prev,
  //     [field]: {
  //       ...prev[field],
  //       value: string,
  //     },
  //   }));
  // }

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
  return <View>
      {tree.map(element => parse_c(element, key++))}
    </View>
}




/**
 * elements [{}]
 *  - name (placeholder for input field)
 *  - type (password | email ...)
 *  - instruction (text field instruction string)
 * 
 * callbacks {}
 *  - on_return()
 *  - on_submit(form_data)
 */
// const NFform = ({ elements, callbacks, error, error_message }) => {

//   const [form_data, set_form_data] = useState(() => {
//     const init_state = {};
//     elements.forEach(element => {
//       let init_value = {};
//       init_value['value'] = '';
//       init_value['type'] = element.type;
//       if (element.type === 'password') init_value['secure'] = true;
//       init_state[element.name] = init_value;
//     });
//     return init_state;
//   });

//   function on_input(field, string) {
//     set_form_data(prev => ({
//       ...prev,
//       [field]: {
//         ...prev[field],
//         value: string,
//       },
//     }));
//   }

//   return (
//     <View style={formStyles.form_border}>
//       {elements.map((elem, index) => (
//         <View key={index}>
//           <Text style={formStyles.form_instruction_text}>
//             {elem.instruction}
//           </Text>
//           <TextInput
//             style={formStyles.input_border}
//             placeholder={`ENTER ${elem.name}`}
//             value={form_data[elem.name].value}
//             onChangeText={text => on_input(elem.name, text)}
//             secureTextEntry={form_data[elem.name].secure}
//           />
//           {error ? <Text style={formStyles.form_instruction_text}>{error_message}</Text> : null}
//         </View>
//       ))}
//       <Button title={'SUBMIT'} onPress={() => callbacks.on_submit(form_data)} />
//       <Button
//         style={navigationStyles.return_button}
//         title={'RETURN'}
//         onPress={() => callbacks.on_return()}
//       />
//     </View>
//   );
// };