import { useState, useRef, useEffect } from 'react';
import { Text } from 'react-native';

import { NFform, components_e } from './reuse/components.js';
import { NFmessagetypes_e, NFmessagedriver, NFlistener } from './message_driver.js';

import gl from './globals.js';

import { styles } from './reuse/styles.js';

const page_e = {
  LANDING_LOGIN: 0,
  LANDING_REGISTER: 1,
  STARTING: 2,
};

/**
 * useRefs define variables that persists over the lifetime of the component.
 * If not useRef, since each re-render calls the entire component's code, the variables would be re-created as well.
 * Changing the value of a useRef() does not trigger a re-render.
 * 
 * useStates define variables that persist over the lifetime of the component.
 * useState's initializer is run only on the very first render. After that, it is not re-initialized.
 * Changing the value of a useState() triggers a re-render.
 * 
 * useEffects define a function to be called whenever any variable provided in an array changes.
 * useEffect returns a function that is executed when the user navigates away from this code path.
 */

function App() {
  // 
  // 
  // 
  const message_driver = useRef(NFmessagedriver()).current;
  
  //  
  // Websocket
  // 
  const [connected, setConnected] = useState(false); // indicates connection to server
  const [alt, setAlt] = useState(false); // used for reconnecting to server
  const ws = useRef(null); // ref that holds the websocket at ws.current
  useEffect(() => {
    ws.current = new WebSocket(`${gl.SERVERIP}:${gl.PORT}`);
    ws.current.onopen = () => {
      setConnected(true);
    };
    ws.current.onclose = () => {
      setConnected(false);
      if(gl.ATTEMPT_RECONNECT) 
        setTimeout(() => setAlt(!alt), gl.RECONNECT_INTERVAL_MS);
    };
    ws.current.onerror = e => {
      if(gl.DEBUG) console.log("ERROR:", e);

      setConnected(false);
      if(gl.ATTEMPT_RECONNECT)
          setTimeout(() => setAlt(!alt), gl.RECONNECT_INTERVAL_MS);
    }
    ws.current.onmessage = on_message;
    return () => {
      ws.current && ws.current.close();
    };
  }, [alt]);

  function on_message(msg) {
    if(gl.DEBUG) console.log("MESSAGE:", msg.data);
    const { type, event } = JSON.parse(msg.data);
    event_driver.insert_message(type, event);
  }

  function send_message(msg) {
    if(!connected) {
      if(gl.DEBUG) console.log("NOT CONNECTED");
      return false;
    }
    ws.current.send(msg);
  }

  // 
  // 
  // 
  useEffect(() => {
    const intervalId = setInterval(() => {
      for(const message_type of Object.values(NFmessagetypes_e)) {
        if(gl.DEBUG) console.log(`CLEARING EVENT BUFFER FOR TYPE ${message_type}`);
        message_driver.clear_messages(message_type);
      }
    }, gl.EVENT_BUFFER_CLEAR_INTERVAL);
    return () => clearInterval(intervalId);
  }, [message_driver]);

  // 
  // Page navigation
  // 
  const [selected_page, set_selected_page] = useState(page_e.LANDING_REGISTER);

  //
  // SIGN UP / LOGIN
  // 
  const [form_data, set_form_data] = useState({});
  const [user_management_error, set_user_management_error] = useState(0);
  function initialize_form_data(tree) {
    const init_state = {};
    tree.forEach(element => {
      if(element.type !== components_e.TEXTINPUT) return;

      let init_value = {};
      init_value['value'] = '';
      init_value['name'] = element.name;

      init_state[element.name] = init_value;
    });
    return init_state;
  }
  function on_form_input(field, string) {
    set_form_data(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value: string,
      },
    }));
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  switch (selected_page) {
    case page_e.LANDING_REGISTER: 
    { 

      function on_signup_message(message) {
        if(gl.DEBUG) console.log("REGISTER MESSAGE: ", message);
        
        // 
        // TODO change
        // 
        setEmail(message.email);
        setPassword(message.password);
        set_selected_page(page_e.LANDING_LOGIN);
      }

      function on_submit_register() {
        if(gl.DEBUG) console.log("REGISTER SUBMITTED: ", form_data);

        //
        // TODO change
        // 
        message_driver.insert_message(NFmessagetypes_e.REGISTER, {
          email: form_data.email.value,
          password: form_data.password.value
        });
      }

      const tree = [
        { type: components_e.TEXT, text: 'ENTER YOUR EMAIL' },
        { 
          type: components_e.TEXTINPUT, 
          name: 'email', 
          placeholder: 'your@mail',
          secure: false
        },
        { type: components_e.TEXT, text: 'ENTER YOUR PASSWORD'},
        {
          type: components_e.TEXTINPUT, 
          name: 'password', 
          secure: true
        },
        {
          type: components_e.CONDITIONALTEXT,
          enabled: user_management_error,
          text: 'FAILED TO REGISTER'
        },
        {
          type: components_e.BUTTON,
          text: 'SUBMIT REGISTER FORM',
          callback: on_submit_register
        },
        {
          type: components_e.BUTTON,
          text: 'RETURN TO LOGIN',
          callback: () => { 
            set_selected_page(page_e.LANDING_LOGIN)
          }
        }
      ];

      useEffect(() => {
        const register_listener = NFlistener(NFmessagetypes_e.REGISTER);

        set_form_data(initialize_form_data(tree));
        set_user_management_error(0);

        register_listener.set_callback(on_signup_message);
        message_driver.add_listener(register_listener);

        return () => {
          message_driver.remove_listener_obj(register_listener);
        }
      }, [selected_page]);

      return <NFform tree={tree} form_data={form_data} on_form_input={on_form_input}/>;
    }

    case page_e.LANDING_LOGIN: 
    {
      function on_login_message(message) {
        if(gl.DEBUG) console.log("LOGIN MESSAGE: ", message);

        if(message.email !== email || message.password !== password)
        {
          set_user_management_error(1);
          return;
        }
        set_selected_page(page_e.STARTING);
      }

      function on_submit_login() {
        if(gl.DEBUG) console.log("LOGIN SUBMITTED: ", form_data);

        message_driver.insert_message(NFmessagetypes_e.LOGIN, {
          email: form_data.email.value,
          password: form_data.password.value
        });
      }

      const tree = [
        { type: components_e.TEXT, text: 'ENTER YOUR EMAIL' },
        { 
          type: components_e.TEXTINPUT, 
          name: 'email', 
          placeholder: 'your@mail',
          secure: false
        },
        { type: components_e.TEXT, text: 'ENTER YOUR PASSWORD'},
        {
          type: components_e.TEXTINPUT, 
          name: 'password', 
          secure: true
        },
        {
          type: components_e.CONDITIONALTEXT,
          enabled: user_management_error,
          text: 'FAILED TO LOG IN'
        },
        {
          type: components_e.BUTTON,
          text: 'SUBMIT LOGIN FORM',
          callback: on_submit_login
        },
        {
          type: components_e.BUTTON,
          text: 'REGISTER',
          callback: () =>  {
            set_user_management_error(0);
            set_selected_page(page_e.LANDING_REGISTER)
          }
        }
      ];

      useEffect(() => {
        const login_listener = NFlistener(NFmessagetypes_e.LOGIN);

        set_form_data(initialize_form_data(tree));
        set_user_management_error(0);

        login_listener.set_callback(on_login_message);
        message_driver.add_listener(login_listener);

        return () => {
          message_driver.remove_listener_obj(login_listener);
        }
      }, [selected_page]);

      return <NFform tree={tree} form_data={form_data} on_form_input={on_form_input}/>;
    }

    default:
     return <Text>HELLO WORLD</Text>;
  }
}

export default App;
