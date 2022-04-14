import React from 'react';
import { withAppContext } from '../context';

import UserMessage from './userMessage';
import FileMessage from './fileMessage';
import AdminMessage from './adminMessage';

const Message = props => {
  const { message } = props;
  let component = null;
  if (message.isUserMessage()) {
    component = <UserMessage {...props} />;
  } else if (message.isFileMessage()) {
    component = <FileMessage {...props} />;
  } else if (message.isAdminMessage()) {
    component = <AdminMessage {...props} />;
  }
  return component;
};

export default withAppContext(Message);
