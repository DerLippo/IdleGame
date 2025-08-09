
import { useState, useEffect } from 'react';

import { NFlistener } from './message_driver';
import { NFmessagetypes_e } from './message_driver';
import { components_e } from './reuse/component_parser';

import { NFform } from './reuse/form';

import { gl, page_e } from './globals.js'

export const UserVerifier = ({selected_page, on_logged_in_callback, message_driver}) => {

  // Internal page state (avoids involving parent in rerenders)
  const [internal_selected_page, internal_set_selected_page] = useState(selected_page);

  /** Boolean indicating if a user induced error occured */
  const [user_management_error, set_user_management_error] = useState(0);

  const [form_data, set_form_data] = useState({});
  
  /**
   * Function for generating the initial state of the useState from the tree.
   * Only the TEXTINPUT components are relevant and mutated by the form.
   */
  function initialize_form_data(tree) {
    const init_state = {};

    tree.forEach(element => {
      if(element.type !== components_e.TEXTINPUT) return;

      let init_value = {};

      // String typed into the TextInput
      init_value['value'] = '';
      // Element's name (infers type) as redundancy for later evaluation 
      init_value['name'] = element.name;

      // An element in form_data can be located by its name
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

  /** Function called when REGISTER-type message incoming */
  function on_register_message(message) {
    if(gl.DEBUG) console.log("REGISTER MESSAGE: ", message);

    if(message.value) {
      internal_set_selected_page(page_e.LANDING_LOGIN);
    }
    else {
      set_user_management_error(1);
    }
  }

  /** Function called when LOGIN-type message incoming */
  function on_login_message(message) {
    if(gl.DEBUG) console.log("LOGIN MESSAGE: ", message);

    if(message.value) {
      on_logged_in_callback(message);
    }
    else {
      set_user_management_error(1);
    }
  }

  function on_submit_register() {
    if(gl.DEBUG) console.log("REGISTER SUBMITTED: ", form_data);

    const message = {
      type: NFmessagetypes_e.REGISTER,
      email: form_data.email.value,
      password: form_data.password.value
    };

    message_driver.insert_message(NFmessagetypes_e.SENDMESSAGE, message);
  }

  function on_submit_login() {
    if(gl.DEBUG) console.log("LOGIN SUBMITTED: ", form_data);

    const message = {
      type: NFmessagetypes_e.LOGIN,
      email: form_data.email.value,
      password: form_data.password.value
    };

    message_driver.insert_message(NFmessagetypes_e.SENDMESSAGE, message);
  }

  switch(internal_selected_page) {
    case page_e.LANDING_REGISTER: 
    {
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
            internal_set_selected_page(page_e.LANDING_LOGIN)
          }
        }
      ];

      // useEffect that is executed only if the page changes and this is the path chosen
      useEffect(() => {
        // Create new listener for REGISTER-type messages
        const listener = NFlistener(NFmessagetypes_e.REGISTER);

        // Generate initial state of the form from the tree
        set_form_data(initialize_form_data(tree));

        // Reset any errors
        set_user_management_error(0);

        // Set the function called when a message of the relevant type is received by the listener
        listener.set_callback(on_register_message);

        // Add the listener to the messaging system
        message_driver.add_listener(listener);

        // this function is called when this switch-case is left. It will remove the listener from the system
        return () => {
          message_driver.remove_listener_obj(listener);
        }
      }, [selected_page, internal_selected_page]);

      // Render the react-native components based on the tree
      return <NFform tree={tree} form_data={form_data} on_form_input={on_form_input}/>;
    }
    case page_e.LANDING_LOGIN: 
    {
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
          text: 'GO TO REGISTER',
          callback: () =>  {
            internal_set_selected_page(page_e.LANDING_REGISTER)
          }
        }
      ];

      useEffect(() => {
        const listener = NFlistener(NFmessagetypes_e.LOGIN);

        set_form_data(initialize_form_data(tree));
        set_user_management_error(0);

        listener.set_callback(on_login_message);
        message_driver.add_listener(listener);

        return () => {
          message_driver.remove_listener_obj(listener);
        }
      }, [selected_page, internal_selected_page]);

      return <NFform tree={tree} form_data={form_data} on_form_input={on_form_input}/>;
    }

    default: 
    {
      return null;
    }
  }
}