import React from 'react';
import logo from './logo.svg';

import './App.css';

function App() {
  /*useEffect(() => {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.selectedText) {
        console.log(message.selectedText);
      }
    });
  }, []);
  */
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
