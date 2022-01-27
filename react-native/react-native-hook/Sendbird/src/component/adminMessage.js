import React from 'react';
import { Text, View } from 'react-native';

import { withAppContext } from '../context';

const AdminMessage = props => {
  const { message } = props;
  return (
    <>
      <View style={style.container}>
        <Text style={style.message}>{message.message}</Text>
      </View>
    </>
  );
};

const style = {
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  message: {
    fontSize: 18,
    color: '#ccc',
  },
};

export default withAppContext(AdminMessage);
