import Vec2 from './Class/Vec2';
import Layer from './Class/Layer';

const constant = {
	mapStart: new Vec2(88, 44), // 地圖的起始點位子(左上座標)
	mapSize: new Vec2(32, 16), // 地圖的網格格局
	gridWidth: 32, // 地圖的每格寬度
	blockColor: '#E0E0E0', // 場外格子底色
	startColor: '#BBFFBB', // 起點格子底色
	endColor: '#FF9797', // 終點格子底色
	noneColor: '#FFFFFF', // 空地格子底色
	deadColor: '#D2A2CC', // 毒面格子底色
	iceColor: '#D9FFFF', // 冰面格子底色
	muddyColor: "#D6D6AD", // 泥面格子底色
	boundaryColor: '#0080FF', // 邊界格線顏色
	auxiliaryColor: '#D2E9FF', // 輔助格線顏色
	typeLayerPairs: { // 各類格子佔據的層數
		'none': new Layer(),
		'block': new Layer(0),
		'none start': new Layer(0, 1, 2, 3),
		'none end': new Layer(0, 1, 2, 3),
		'none dead': new Layer(),
		'none ice': new Layer(),
		'none muddy': new Layer()
	},
};

export default constant;