import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Wordle from './components/pages/wordle/Wordle';
import Error from "./components/pages/error/Error";
import { words } from './resources/word-data';
import './App.css';

const App = () => {
  return (
    <HashRouter>
      <Switch>
          <Route path="/" component={() => <Wordle words={words} />} exact/>
          <Route render={(props) => <Error {...props}/>}/>
      </Switch>
    </HashRouter>
  );
}

export default App;
