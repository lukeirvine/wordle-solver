import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Wordle from './components/pages/wordle/Wordle';
import Error from "./components/pages/error/Error";
import './App.css';

const App = () => {
  return (
    <HashRouter>
      <Switch>
          <Route path="/" component={Wordle} exact/>
          <Route render={(props) => <Error {...props}/>}/>
      </Switch>
    </HashRouter>
  );
}

export default App;
