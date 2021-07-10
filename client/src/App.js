import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';

const App = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Join} />
      <Route path="/chat" exact component={Chat} />
    </BrowserRouter>
  );
};

export default App;
