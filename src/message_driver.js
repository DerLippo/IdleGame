
export const NFmessagetypes_e = {
  LOGIN: 0,
  REGISTER: 1,
  SENDMESSAGE: 2,
};

export class NFlistener_impl  {
  constructor(message_type) {
    this.i_type = message_type;
    this.i_index = null;
    this.i_notify = null;
  }
  set_callback(notify_callback) {
    this.i_notify = notify_callback;
  }
  index_change(new_index){
    this.i_index = new_index;
  }
  notify(message) {
    if(this.i_notify)
      this.i_notify(message);
  }
  type() {
    return this.i_type;
  }
  index() {
    return this.i_index;
  }
};

export class NFmessagedriver_impl {
  constructor() {
    this.listeners = [];
    this.messages = [];
    this.sizes = []; 
    
    for(let type of Object.values(NFmessagetypes_e)) {
      this.listeners[type] = [];
      this.messages[type] = [];
      this.sizes[type] = 0;
    }
  }

  insert_message(message_type, message) {
    this.messages[message_type].push(message);
    this.notify_listeners(message_type, message);
  }

  notify_listeners(message_type, message) {
    for(let i = 0; i < this.sizes[message_type]; ++i) {
      const listener = this.listeners[message_type][i];
      if(listener) // shouldn't be possible, just in case
        listener.notify(message);
    }
  }

  clear_messages(message_type) {
    this.messages[message_type] = [];
  }

  add_listener(listener) {
    if(listener.type() === null || listener.type() === undefined) {
      return;
    }

    const index = this.sizes[listener.type()]++;

    if(index >= this.listeners[listener.type()].length) {
      this.listeners[listener.type()].push(null);
    }

    this.listeners[listener.type()][index] = listener;
    listener.index_change(index);
  }

  remove_listener_obj(listener) {
    this.remove_listener(listener.type(), listener.index());
  }
  remove_listener(message_type, index) {
    const listener_to_remove = this.listeners[message_type][index];
    if(listener_to_remove) {
      listener_to_remove.index_change(null);
    }

    const last_index = this.sizes[message_type] - 1;

    if(index < last_index) {
      const last_listener = this.listeners[message_type][last_index];
      this.listeners[message_type][index] = last_listener;
      if(last_listener)
        last_listener.index_change(index);
    }

    this.listeners[message_type][last_index] = null;
    --this.sizes[message_type];
  }
};


export function NFlistener(message_type) {
  let listener = new NFlistener_impl(message_type);

  return listener;
}

export function NFmessagedriver() {
  let driver = new NFmessagedriver_impl();

  return driver;
}