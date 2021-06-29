import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';

import {
  useHistory,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  main: {
    backgroundColor: 'white',
    textAlign: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#6e5baa',
    '&:hover': {
      backgroundColor: '#825deb',
    },
  },
  checkbox: {
    '&.Mui-checked': {
      color: '#825deb',
    },
  },
  input: {
    '& .Mui-focused': {
      color: '#825deb',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#825deb',
      },
    }
  },
  avatar: {
    marginTop: 20,
    width: 127 / 2,
    height: 150 / 2,
    borderRadius: 0,
  },
}));

export default function SignIn({ onSubmit }) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Container component="main" maxWidth="xs" className={classes.main}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          alt="Sendbird Logo"
          src="https://dxstmhyqfqr1o.cloudfront.net/symbol/Sendbird_Symbol_PNG/Sendbird_Symbol_RGB.png"
          className={classes.avatar}
        />
        <Typography component="h1" variant="h5">
          Sendbird | UIKit Sample
        </Typography>
        <form
          className={classes.form}
          onSubmit={e => {
            e.preventDefault();
            onSubmit({
              userId: e.target.userId.value,
              nickname: e.target.nickname.value,
              theme: e.target.theme.checked ? 'dark' : 'light',
            });
            history.push('/chat');;
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="userId"
            label="User Id"
            name="userId"
            className={classes.input}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="nickname"
            label="Nick Name"
            id="nickname"
            className={classes.input}
          />
          <FormControlLabel
            control={<Checkbox value="dark" color="primary" name="theme" className={classes.checkbox} />}
            label="Apply dark theme"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
        </form>
      </div>
      <Typography variant="body1">
        Start chatting on Sendbird by choosing your username and nickname.
      </Typography>
    </Container>
  );
}
