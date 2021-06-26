import constant from './constant';
import Layer from './Class/Layer';
import { spikedBlock, platform, bow, movingPlatform, mucus, cymbal, ice, conveyor, portal, trapPlatform, missileBase, lockedWall, unlocker, block, movingPlatform_oblique, movingPlatform_rect, woodenBox, magnet, brokenPlatform, deathTotem } from './Class/GameObject';

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
    let count = 0;
    for (let i = 0; i < setting.objects.length; i++) {
        if (setting.objects[i].enpackage) levelSetting.objects[count++] = setting.objects[i].enpackage();
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
            case 'spikedBlock':
                setting.objects[i] = new spikedBlock();
                break;
            case 'platform':
                setting.objects[i] = new platform();
                break;
            case 'movingPlatform':
                setting.objects[i] = new movingPlatform();
                break;
            case 'bow':
                setting.objects[i] = new bow();
                break;
            case 'mucus':
                setting.objects[i] = new mucus();
                break;
            case 'cymbal':
                setting.objects[i] = new cymbal();
                break;
            case 'ice':
                setting.objects[i] = new ice();
                break;
            case 'conveyor':
                setting.objects[i] = new conveyor();
                break;
            case 'portal':
                setting.objects[i] = new portal();
                break;
            case 'trapPlatform':
                setting.objects[i] = new trapPlatform();
                break;
            case 'missileBase':
                setting.objects[i] = new missileBase();
                break;
            case 'lockedWall':
                setting.objects[i] = new lockedWall();
                break;
            case 'unlocker':
                setting.objects[i] = new unlocker();
                break;
            case 'block':
                setting.objects[i] = new block();
                break;
            case 'movingPlatform_oblique':
                setting.objects[i] = new movingPlatform_oblique();
                break;
            case 'movingPlatform_rect':
                setting.objects[i] = new movingPlatform_rect();
                break;
            case 'woodenBox':
                setting.objects[i] = new woodenBox();
                break
            case 'magnet':
                setting.objects[i] = new magnet();
                break;
            case 'brokenPlatform':
                setting.objects[i] = new brokenPlatform();
                break;
            case 'deathTotem':
                setting.objects[i] = new deathTotem();
                break;
            default:
                break;
        }
        setting.objects[i].unpackage(levelSetting.objects[i]);
        setting.objects[i].place(setting.map, setting.objects);
    }
    return setting;
}

export function show(levelSetting) {
    const util = require('util');

    console.log(util.inspect(levelSetting, { showHidden: false, depth: null }));
}