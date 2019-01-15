# Customize to ReactJS
This sample is not built on ReactJS.  
If you want to use with ReactJS, you need to modify it to fit ReactJS and rebuild it using webpack.  

If you want to combine to ReactJS at the current condition, follow the instructions below.  

## Modify Widget Sample
### Modify `widget.js`
Remove `window.sbWidget = new SBWidget();` and add below at the last line in `widget.js`. 
```javascript
// window.sbWidget = new SBWidget();
var sbWidget = new SBWidget();
window.sbWidget = sbWidget;
export default sbWidget;
```

### Modify `webpack.config.js`
Add `library` and `libraryTarget` in `output` field of `webpack.config.js`.  
```javascript
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: '[name].SendBird.js',
    publicPath: 'dist',
    library: 'SendBirdWidget',
    libraryTarget: 'umd'
  },
```

### Rebuild Widget Sample
Rebuild widget sample using webapck.  
```bash
npm run build
```

## React App
### Create React App
Create new application using [Create-React-App](https://github.com/facebook/create-react-app#creating-an-app).  
```bash
npm install -g create-react-app
create-react-app my-app

cd my-app
```

And ejecting using `eject` command.  
```bash
npm run eject
```

### Install SendBird and copy from widget sample
Install `SendBird JavaScript SDK` using npm.  
```bash
npm install --save sendbird
```

`widget.SendBird.js` in widget sample copy to `my-app/src`.  

### Customizing ESLint
Create `.eslintrc` file to customize eslint rules.  
```javascript
{
  "extends": "react-app",
  "rules": {
    "no-undef": "warn"
  }
}
```

### Modify App.js and App.css
Change to the code below.  
```javascript 
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SendBird from 'sendbird';
import SendBirdWidget from './widget.SendBird';

class App extends Component {
  componentDidMount() {
    window.SendBird = SendBird;
    SendBirdWidget.start('APP_ID'); // Sample APP_ID: '9DA1B1F4-0BE6-4DA8-82C5-2E81DAB56F23'
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div id="sb_widget"></div>
      </div>
    );
  }
}

export default App;
```

Remove `text-align` in App.css
```css
.App {
  /* text-align: center; */
}
```

### Start ReactJS App
```bash
npm start
```
