import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn({ onSubmit }) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form
          className={classes.form}
          onSubmit={e => {
            e.preventDefault();
            onSubmit({
              userId: e.target.userId.value,
              nickname: e.target.nickname.value,
              theme: e.target.theme.checked ? 'dark' : 'light',
              useCustomQuery: e.target.useCustomQuery.checked,
            });
            history.push('/chat');
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
          />
          <FormControlLabel
            control={<Checkbox value="dark" color="primary" name="theme" />}
            label="Apply dark theme"
          />
          <FormControlLabel
            control={<Checkbox value="customQuery" color="primary" name="useCustomQuery" />}
            label="Use custom user list"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Start
          </Button>
        </form>
      </div>
    </Container>
  );
}
