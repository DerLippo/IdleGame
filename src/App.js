import { useState } from 'react';
import { View, Button, TextInput } from 'react-native';

import Make_text from './text.js';
import NFform from './reuse/components.js'

import tempres from './temporary_server_responses.js';

import { styles, formStyles } from './reuse/styles.js';

const page_e = {
  LANDING_LOGIN: 0,
  LANDING_REGISTER: 1,
  STARTING: 2,
};

function App() {
  const [SELECTEDPAGE, SET_SELECTEDPAGE] = useState(page_e.LANDING_REGISTER);

  const [EMAIL_TEXT, CHANGE_EMAILTEXT] = useState('');
  const [PASSWORD_TEXT, CHANGE_PASSWORDTEXT] = useState('');

  function check_login_data() {
    /**
     * TODO server requests
     *      validity check
     */
    if (
      tempres.login_response({ email: EMAIL_TEXT, password: PASSWORD_TEXT })
    ) {
      CHANGE_EMAILTEXT('');
      CHANGE_PASSWORDTEXT('');
      SET_SELECTEDPAGE(page_e.STARTING);
    }
  }

  function check_register_data() {
    /**
     * TODO server requests
     *      validity checks
     */

    if (
      tempres.register_response({ email: EMAIL_TEXT, password: PASSWORD_TEXT })
    ) {
      CHANGE_EMAILTEXT('');
      CHANGE_PASSWORDTEXT('');
      SET_SELECTEDPAGE(page_e.LANDING_LOGIN);
    }
  }

  switch (SELECTEDPAGE) {
    case page_e.LANDING_LOGIN: {
      const elements = [
        {'type': 'email', 'name': 'email', 'instruction': 'ENTER YOUR EMAIL'},
        {'type': 'password', 'name': 'password', 'instruction': 'ENTER YOUR PASSWORD'}
      ];
      const callbacks = {
        on_success: () => {},
        on_return: () => {}
      };

      return (
        <View style={styles.container}>
          <NFform 
            callbacks={callbacks}
            elements={elements}
          />
        </View>
      )



      // return (
      //   <View style={styles.container}>
      //     <View style={formStyles.form_border}>
      //       <Make_text
      //         args={formStyles.form_instruction_text}
      //         string={'EMAIL:'}
      //       />
      //       <TextInput
      //         style={formStyles.input_border}
      //         onChangeText={text => CHANGE_EMAILTEXT(text)}
      //         value={EMAIL_TEXT}
      //         textContentType="email"
      //         autoComplete="email"
      //       />
      //       <Make_text
      //         args={formStyles.form_instruction_text}
      //         string={'PASSWORD:'}
      //       />
      //       <TextInput
      //         style={formStyles.input_border}
      //         onChangeText={text => CHANGE_PASSWORDTEXT(text)}
      //         value={PASSWORD_TEXT}
      //         textContentType="password"
      //         autoComplete="current-password"
      //         secureTextEntry
      //       />
      //       <Button title={'SUBMIT'} onPress={() => check_login_data()} />
      //     </View>
      //     <Button
      //       title={'REGISTER'}
      //       onPress={() => SET_SELECTEDPAGE(page_e.LANDING_REGISTER)}
      //     />
      //   </View>
      // );
    }
    case page_e.LANDING_REGISTER: {
      return (
        <View style={styles.container}>
          <View style={formStyles.form_border}>
            <Make_text
              args={formStyles.form_instruction_text}
              string={'WHAT IS YOUR EMAIL:'}
            />
            <TextInput
              style={formStyles.input_border}
              onChangeText={text => CHANGE_EMAILTEXT(text)}
              value={EMAIL_TEXT}
              textContentType="email"
              autoComplete="email"
            />
            <Make_text
              args={formStyles.form_instruction_text}
              string={'WHAT IS YOUR PASSWORD:'}
            />
            <TextInput
              style={formStyles.input_border}
              onChangeText={text => CHANGE_PASSWORDTEXT(text)}
              value={PASSWORD_TEXT}
              textContentType="password"
              autoComplete="current-password"
              secureTextEntry
            />
            <Button title={'SUBMIT'} onPress={() => check_register_data()} />
          </View>
        </View>
      );
    }
    default:
      return (
        <Make_text
          args={{ fontSize: 10, textAlign: 'center' }}
          string={'CLICK HERE FOR LEVEL UP 😂'}
        />
      );
  }

  /*
😂
<TextInput
  editable
  multiline
  numberOfLines={4}
  maxLength={40}
  onChangeText={text => CHANGE_EMAILTEXT(text)}
  value={EMAIL_TEXT}
  style={{
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 8,
    minHeight: 40,
    padding: 8,
    marginTop: 16,
    color: 'black'
  }}
/>
😂😂😂
<TextInput
  textContentType="username"
  autoComplete="username"
  autoCapitalize="none"
/>
<TextInput
  textContentType="password"
  autoComplete="password"
  secureTextEntry
/>
            */

  // switch (SELECTEDPAGE) {
  //   case page_e.MAINPAGE:
  //     new_h1_text['backgroundColor'] = '#ff0000';

  //     return (
  //       <View style={styles.container}>
  //         <Make_text args={new_h1_text} string={'hello MAINPAGE'} />
  //         <Button
  //           title={'Click me'}
  //           onPress={() => SET_SELECTEDPAGE(PAGE.STARTINGPAGE)}
  //         />
  //       </View>
  //     );
  //   default:
  //     new_h1_text['backgroundColor'] = 'green';

  //     return (
  //       <View style={styles.container}>
  //         <Make_text args={new_h1_text} string={'hello STARTINGPAGE'} />
  //         <Button
  //           title={'Click me'}
  //           onPress={() => SET_SELECTEDPAGE(PAGE.MAINPAGE)}
  //         />
  //       </View>
  //     );
  // }
}

export default App;
