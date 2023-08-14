import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Obs } from './autorun';

const obj = {
  name: 'hello',
  age : 23
}
function App() {
  let proxyS = Obs.observable<typeof obj>(obj)
  
  Obs.autorun(() => {
    console.log(proxyS.name)
  })

  Obs.autorun(() => {
    console.log(proxyS.age)
  })

  useEffect(() => {
    setTimeout(() => {
      proxyS.name = 'world'
    }, 2000);
  },[])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
