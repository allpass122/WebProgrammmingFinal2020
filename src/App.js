import './App.css';
import React from 'react';
import { useState } from 'react';
import EditMode from './GameContainer/EditMode/Main';
import example from './GameContainer/Setting/example_0';
import { enpackage, unpackage, show } from './GameContainer/DataPackager';

function App() {
    localStorage.removeItem('levelSetting');
    const [levelSetting, setLevelSetting] = useState(example);
    const save = (setting) => {
        setLevelSetting(enpackage(setting));
        show(enpackage(setting));
    }

    return (
        <div>
            <EditMode width="1200px" height="700px" setting={unpackage(levelSetting)} save={save} />         
        </div>
    );
}

export default App;
