import { Text } from 'react-native';

export const components_e = {
  TEXT: 0,
  CONDITIONALTEXT: 3,
  TEXTINPUT: 1,
  BUTTON: 2,
};

/**
 * Function for generating react-native components from enum components_e.
 * All types not defined in this function are dependent on the purpose and usages of the parent component.
 * These types must be defined seperately in the parent component 
 */
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