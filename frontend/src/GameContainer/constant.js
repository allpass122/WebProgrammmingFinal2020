import Vec2 from './Class/Vec2';
import Layer from './Class/Layer';

const constant = {
	mapStart: new Vec2(88, 0), // 地圖的起始點位子(左上座標)
	mapSize: new Vec2(32, 16), // 地圖的網格格局
	gridWidth: 32, // 地圖的每格寬度
	blockColor: '#E0E0E0', // 場外格子底色
	startColor: '#DFFFDF', // 起點格子底色
	endColor: '#FFD2D2', // 終點格子底色
	noneColor: '#FFFFFF', // 空地格子底色
	deadColor: '#EBD3E8', // 毒面格子底色
	iceColor: '#D9FFFF', // 冰面格子底色
	muddyColor: "#D6D6AD", // 泥面格子底色
	boundaryColor: '#0080FF', // 邊界格線顏色
	auxiliaryColor: '#D2E9FF', // 輔助格線顏色
	typeLayerPairs: { // 各類格子佔據的層數
		'none': new Layer(),
		'block': new Layer(),
		'start': new Layer(0, 1, 2, 3),
		'end': new Layer(0, 1, 2, 3),
		'dead': new Layer(),
		'ice': new Layer(),
		'muddy': new Layer()
	},
	maxLayer: 5, // 最大佔據層數
	editObjectList: {
		platform: ['platform', 'movingPlatform', 'movingPlatform_oblique', 'movingPlatform_rect', 'trapPlatform', 'brokenPlatform'],
		covering: ['mucus', 'ice', 'conveyor', 'deathTotem'],
		obstacle: ['block', 'spikedBlock', 'woodenBox', 'bow', 'cymbal', 'missileBase'],
		special: ['portal', 'lockedWall', 'unlocker', 'magnet'],
	},
	editFrame: {
		default: { fColor: '#F0F0F0', sColor: '#BEBEBE' },
		platform: { fColor: '#ECECFF', sColor: '#CECEFF' },
		covering: { fColor: '#E8FFF5', sColor: '#96FED1' },
		obstacle: { fColor: '#FFECEC', sColor: '#FFB5B5' },
		special: { fColor: '#FFFFDF', sColor: '#FFFF37' },
    }
};

export default constant;