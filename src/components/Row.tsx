import React from 'react';
import { View } from 'react-native';

const Row: React.FC = (props) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    }}
    {...props}
  />
);

export default Row;
