import React, { useState } from 'react'
import {
  Container,
  Paper,
  Button,
  Input,
  Switch,
} from '@material-ui/core';
import {
  useHistory,
} from "react-router-dom";

export default function Login({ onSubmit }) {
  const [theme, setTheme] = useState(false);
  const history = useHistory();
  return (
    <Container fixed>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit({
            userId: e.target.userId.value,
            nickname: e.target.nickname.value,
            theme: theme ? 'dark' : 'light',
          });
          history.push('/chat');
        }}
        height="100vh"
      >
        <Paper
          style={{
            backgroundColor: '#cfe8fc',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          <div>
            <Input
              type="text"
              name="userId"
              defaultValue="sendbird"
              placeholder="UserId"
              required
            />
          </div>
          <div>
            <Input
              type="text"
              name="nickname"
              defaultValue="sendbird"
              placeholder="Nickname"
              required
            />
          </div>
          <div>
            Dark Theme:
            <Switch
              checked={theme}
              onChange={e => {
                setTheme(!theme)
              }}
              name="dark"
            />
          </div>
          <Button type="submit">Start Chatting</Button>
        </Paper>
      </form>
    </Container>
  )
}
