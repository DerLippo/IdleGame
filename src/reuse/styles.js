import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

const formStyles = StyleSheet.create({
  form_border: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  input_border: {
    borderWidth: 1,
    borderColor: 'orange',
  },
  form_instruction_text: {
    fontSize: 10,
    textAlign: 'left',
  },
});

const navigationStyles = StyleSheet.create({
  return_button: {
    borderWidth: 1,
    borderColor: 'red'
  }
})

export { styles, formStyles, navigationStyles };