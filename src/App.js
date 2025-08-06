import { useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';

import Make_text from './text.js';
import { NFform } from './reuse/components.js';

import tempres from './temporary_server_responses.js';

import { styles } from './reuse/styles.js';

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
    case page_e.LANDING_REGISTER: {
      const elements = [
        { type: 'email', name: 'email', instruction: 'ENTER YOUR EMAIL' },
        {
          type: 'password',
          name: 'password',
          instruction: 'ENTER YOUR PASSWORD',
        },
      ];

      const callbacks = {
        on_success: () => {},
        on_return: () => {},
      };

      return (
        <View style={styles.container}>
          <Text>Register</Text>
          <NFform callbacks={callbacks} elements={elements} />
        </View>
      );
    }
    case page_e.LANDING_LOGIN: {
      const elements = [
        { type: 'email', name: 'email', instruction: 'ENTER YOUR EMAIL' },
        {
          type: 'password',
          name: 'password',
          instruction: 'ENTER YOUR PASSWORD',
        },
      ];
      const callbacks = {
        on_success: () => {},
        on_return: () => {},
      };

      return (
        <View style={styles.container}>
          <Text>Login</Text>
          <NFform callbacks={callbacks} elements={elements} />
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
}

export default App;
