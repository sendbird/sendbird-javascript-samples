import React from 'react';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
// import Input from '@material-ui/core/Input';
// import Button from '@material-ui/core/Button';
// import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

export default function Message({ message, onDeleteMessage, onUpdateMessage }) {
  return (
    <Paper style={{ display: 'flex' }}>
      <CardMedia
        image={
          message.sender && message.sender.profileUrl
        }
        style={{ width: 50, height: 50, marginTop: 25 }}
      />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <CardContent style={{ flex: '1 0 auto', minWidth: 180, textAlign: 'left' }}>
          <Typography variant="body1" noWrap style={{ width: 360 }}>
            {
              // Render your message according to message types
              message.messageType === 'file'
                ? (
                  <Link target="_blank" rel="noreferrer" variant="body2" href={message.url}>
                    {message.name}
                  </Link>
                )
                : `${message.message}`
            }
          </Typography>
          <Typography variant="caption" color="textSecondary">
            { new Date(message.createdAt).toDateString() }
              {` by
                ${message.messageType === 'admin'
                  ? 'Channel Admin'
                  : message.sender && message.sender.userId}
              `}
          </Typography>
        </CardContent>
        {/*  Uncomment to implement delete and update features */}
        {/* <div className={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <DeleteOutlineIcon
            onClick={() => {
              const onDeleteCb = (error, success) => { console.warn(error, success); }
              onDeleteMessage(message, onDeleteCb);
            }}
          >
          </DeleteOutlineIcon>
        </div> */}
        {/* Uncomment to update message*/}
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            const updatedText = e.target.updatedText.value;
            const onUpdateCb = () => { console.warn('message updated'); }
            onUpdateMessage(message.messageId, updatedText, onUpdateCb);
          }}
        >
          <Input name="updatedText" />
          <Button type="submit">Update</Button>
        </form> */}
      </div>
    </Paper>
  )
}
