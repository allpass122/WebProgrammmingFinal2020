import constant from './constant';
import Layer from './Class/Layer';
import { spikedBlock } from './Class/GameObject';

export function enpackage(setting) {
    const levelSetting = {
        map: [],
        objects: [],
    };
    /* 地圖打包 */
    for (let i = 0; i < constant.mapSize.y; i++) {
        let types = [];
        for (let j = 0; j < constant.mapSize.x; j++) {
            types[j] = { type: setting.map[i][j].type }; 
        }
        levelSetting.map[i] = types;
    } 
    /* 物件打包 */
    for (let i = 0; i < setting.objects.length; i++) {
        levelSetting.objects[i] = setting.objects[i].enpackage();
    }
    return levelSetting;
}

export function unpackage(levelSetting) {
    const setting = {
        map: [],
        objects: [],
    } 
    /* 地圖拆包 */
    for (let i = 0; i < constant.mapSize.y; i++) {
        let types = [];
        for (let j = 0; j < constant.mapSize.x; j++) {
            types[j] = { type: levelSetting.map[i][j].type, layer: new Layer() };
        }
        setting.map[i] = types;
    }
    /* 物件拆包 */
    for (let i = 0; i < levelSetting.objects.length; i++) {
        switch (levelSetting.objects[i].type) {
            case 'spikedBlcok':
                setting.objects[i] = new spikedBlock();
                break;
        }
        setting.objects[i].unpackage(levelSetting.objects[i]);
    }
    return setting;
}

export function show(setting) {
    const util = require('util');

    console.log(util.inspect(setting, { showHidden: false, depth: null }));
}