import Vec2 from "../../GameContainer/Class/Vec2"

export default function Controller(scene, status, setStatus, setting) {

	const KeyCode = {37:'left', 38:'up', 39:'right', 40:'down'}

	function onKeyDown(e) {
		switch (KeyCode[e.keyCode]) {
			case 'down':
				status.pressDown = true
				break
			case 'right':
				status.pressRight = true
				break
			case 'left':
				status.pressLeft = true
				break
			case 'up':
				status.pressUp = true
				break
		}
	}

	function onKeyUp(e) {
		switch (KeyCode[e.keyCode]) {
			case 'down':
				status.pressDown = false
				break
			case 'right':
				status.pressRight = false
				break
			case 'left':
				status.pressLeft = false
				break
			case 'up':
				status.pressUp = false
				break
		}
	}

	window.addEventListener('keydown', onKeyDown);
	window.addEventListener('keyup', onKeyUp);

	return () => {
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	};
};



