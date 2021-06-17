import './App.css';
import React from 'react';
import { useState , useEffect , useRef } from 'react';
import EditMode from './GameContainer/EditMode/Main';
import Vec2 from './GameContainer/Class/Vec2';
import constant from './GameContainer/constant';
import Layer from './GameContainer/Class/Layer';

function App() {
	let levelSetting = {
		map: [],
		objects: []
	};
	for (let y = 0; y < constant.mapSize.y; y++) {
		let types = [];
		for (let x = 0; x < constant.mapSize.x; x++) {
			let type = '';
			type = ((x > 1 && x < 6 && y > 5 && y < 10) ||
					(x > 25 && x < 30 && y > 5 && y < 10) ||
					(x > 5 && x < 26 && y > 1 && y < 14))? 'none': 'block'; // none 為可使用的空地，block 為不使用的區塊
			type += (x > 1 && x < 6 && y > 5 && y < 10)? ' start': ''; // start 為起點
			type += (x > 25 && x < 30 && y > 5 && y < 10) ? ' end' : ''; // end 為終點
			types[x] = { type: type };
		}
		levelSetting.map[y] = types;
	}

	for (let i = 0; i < constant.mapSize.x; i++) {
		for (let j = 0; j < constant.mapSize.y; j++) {
			levelSetting.map[j][i].layer = new Layer();
		}
	}

    return (
		<div>
			<EditMode width="1200px" height="700px" setting={levelSetting} />         
        </div>
    );
}

export default App;
