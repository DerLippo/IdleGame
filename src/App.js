import { useState, useRef, useEffect, useCallback } from 'react';
import { Text } from 'react-native';

import { UserVerifier } from './user_verifier.js';
import { NFmessagetypes_e, NFmessagedriver, NFlistener } from './message_driver.js';

import { gl, page_e } from './globals.js';

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
 * IF THERE IS NOTHING PROVIDED THE USEEFFECT RUNS AFTER EVERY RE-RENDER. (It is enough to provide an empty array to stop that behaviour.)
 * useEffect returns a function that is executed when the user navigates away from this code path.
 */

function App() {
  // 
  // Messaging system
  // 
  const message_driver = useRef(NFmessagedriver()).current;

  /** Start clearing message buffer in intervals */
  if(!gl.DEBUG)
    useEffect(() => {
      const interval_id = setInterval(() => {
        for(const message_type of Object.values(NFmessagetypes_e)) {
          if(gl.DEBUG) console.log(`CLEARING EVENT BUFFER FOR TYPE ${message_type}`);
          message_driver.clear_messages(message_type);
        }
      }, gl.EVENT_BUFFER_CLEAR_INTERVAL);

      return () => clearInterval(interval_id);
    }, []);

  /** Listener for SENDMESSAGE-type messages. Components wanting to send data to remote must do so by inserting SENDMESSAGE events into the system. */
  const sendmessage_listener = useRef(NFlistener(NFmessagetypes_e.SENDMESSAGE)).current;

  useEffect(() => {
    sendmessage_listener.set_callback(send_message);
    message_driver.add_listener(sendmessage_listener);
    return () => {
      message_driver.remove_listener_obj(sendmessage_listener);
    }
  }, []);
  
  //  
  // Websocket
  // 
  const [connected, setConnected] = useState(false); // indicates connection to server
  /**
   * This is required to keep functions dependent on the connected variable up-to-date.
   * This is because when one of those functions is given as a callback, it is given in the current state.
   * So if the callback was created when connected is false, when the callback is called later, it will remember that connected was false.
   * It will become *stale*. It is like static in functions in c++.
   * So instead, the function will reference the useRef instead.
   */
  const connected_ref = useRef(connected); // required to keep dependent functions up to date
  useEffect(() => {
    connected_ref.current = connected;
  }, [connected]);

  const [alt, setAlt] = useState(false); // used for reconnecting to server
  const ws = useRef(null); // ref that holds the websocket at ws.current
  useEffect(() => {
    ws.current = new WebSocket(`${gl.SERVERIP}:${gl.PORT}`);
    ws.current.onopen = () => {
      if(gl.DEBUG) console.log("WEBSOCKET CONNECTED");

      setConnected(true);
    };
    ws.current.onclose = () => {
      if(gl.DEBUG) console.log("WEBSOCKET CLOSED");

      setConnected(false);
      if(gl.ATTEMPT_RECONNECT) 
        setTimeout(() => setAlt(!alt), gl.RECONNECT_INTERVAL_MS);
    };
    ws.current.onerror = e => {
      if(gl.DEBUG) console.log("WEBSOCKET ERROR:", e);

      setConnected(false);
      if(gl.ATTEMPT_RECONNECT)
          setTimeout(() => setAlt(!alt), gl.RECONNECT_INTERVAL_MS);
    }
    ws.current.onmessage = on_message;
    return () => {
      ws.current && ws.current.close();
    };
  }, [alt]);

  /** Function receiving messages from remote. Feeds type and data into the messaging system. */
  function on_message(msg) {
    if(gl.DEBUG) console.log("MESSAGE FROM SOCKET: ", msg.data);
    const { type, data } = JSON.parse(msg.data);
    message_driver.insert_message(type, data);
  }

  function send_message(msg) {
    if(!connected_ref.current) {
      if(gl.DEBUG) console.log("CAN NOT SEND MESSAGE; NOT CONNECTED: ", msg);
      return false;
    }
    ws.current.send(JSON.stringify(msg))
  }

  // 
  // Page navigation
  // 
  const [selected_page, set_selected_page] = useState(page_e.LANDING_REGISTER);

  switch (selected_page) {
    case page_e.LANDING_REGISTER: // fallthrough
    case page_e.LANDING_LOGIN: 
    {
      function on_successfully_logged_in() {
        set_selected_page(page_e.STARTING);
      }

      return <UserVerifier 
        selected_page={selected_page}
        on_logged_in_callback={on_successfully_logged_in}
        message_driver={message_driver}
       />
    }

    default:
    {
      return <Text>HELLO WORLD</Text>;
    }
  }
}

export default App;
