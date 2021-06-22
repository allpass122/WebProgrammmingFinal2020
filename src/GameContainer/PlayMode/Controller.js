
export default function Controller(scene, status, setStatus, setting) {

	// const mapStart = constant.mapStart;
	// const mapEnd = constant.mapStart.add(constant.mapSize.mul(constant.gridWidth));
	// const w = constant.gridWidth;
	const KeyCode = {37:'left', 38:'up', 39:'right', 40:'down'}

	function onKeyDown(e) {
		status.me.push(KeyCode[e.keyCode] )
	}

	window.addEventListener('keydown', onKeyDown);

	return () => {
		window.removeEventListener('keydown', onKeyDown);
	};
};



