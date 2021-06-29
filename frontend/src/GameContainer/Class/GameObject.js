import Vec2 from './Vec2';
import constant from '../constant';
import Layer from './Layer';

const uuidv4 = require("uuid/v4");
const w = constant.gridWidth;
const isCollision = (obj1, obj2) => {
    if (obj1.type === 'sphere' && obj2.type === 'sphere') {
        return obj1.pos.sub(obj2.pos).length() <= (obj1.r + obj2.r);
    }
    if ((obj1.type === 'sphere' && obj2.type === 'cube') || (obj2.type === 'sphere' && obj1.type === 'cube')) {
        const sObj = (obj1.type === 'sphere') ? obj1 : obj2;
        const cObj = (obj1.type === 'cube') ? obj1 : obj2;
        if (sObj.pos.between(cObj.pos.sub(cObj.size.mul(0.5)).sub(new Vec2(sObj.r, 0)), cObj.pos.add(cObj.size.mul(0.5)).add(new Vec2(sObj.r, 0)))) return true;
        if (sObj.pos.between(cObj.pos.sub(cObj.size.mul(0.5)).sub(new Vec2(0, sObj.r)), cObj.pos.add(cObj.size.mul(0.5)).add(new Vec2(0, sObj.r)))) return true;
        const pointList = ([[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]).map(p => cObj.pos.add(new Vec2(p[0] * cObj.size.x, p[1] * cObj.size.y)));
        return Math.min(pointList.map(p => p.sub(sObj.pos))) <= sObj.r;
    }
    if (obj1.type === 'cube' && obj2.type === 'cube') {
        return (Math.abs(obj1.pos.x - obj2.pos.x) <= (obj1.size.x / 2 + obj2.size.x / 2)) && (Math.abs(obj1.pos.y - obj2.pos.y) <= (obj1.size.y / 2 + obj2.size.y / 2));
    }
    return false;
};
const colorList = ['#FF0000', '#FFA042', '#F9F900', '#02DF82', '#6A6AFF', '#D0D0D0', '#E800E8', '#984B4B'];

/* 尖刺方塊 */
export class spikedBlock {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'spikedBlock';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '尖刺方塊',
            upSpike: true,
            downSpike: true,
            leftSpike: true,
            rightSpike: true,
        };

        this.loadable = false;

        this.perspective = false;

        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new spikedBlock();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            upSpike: { type: 'check' },
            downSpike: { type: 'check' },
            leftSpike: { type: 'check' },
            rightSpike: { type: 'check' },
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            upSpike: this.detail.upSpike,
            downSpike: this.detail.downSpike,
            leftSpike: this.detail.leftSpike,
            rightSpike: this.detail.rightSpike,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.upSpike = objectSetting.upSpike;
        this.detail.downSpike = objectSetting.downSpike;
        this.detail.leftSpike = objectSetting.leftSpike;
        this.detail.rightSpike = objectSetting.rightSpike;

        this.perspective = true;
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(w, w) }, target)) return 'block';
        if ((this.detail.leftSpike && isCollision({ type: 'cube', pos: this.pos.add(new Vec2(-0.625 * w, 0)), size: new Vec2(0.25 * w, 0.75 * w) }, target)) ||
            (this.detail.rightSpike && isCollision({ type: 'cube', pos: this.pos.add(new Vec2(0.625 * w, 0)), size: new Vec2(0.25 * w, 0.75 * w) }, target)) ||
            (this.detail.upSpike && isCollision({ type: 'cube', pos: this.pos.add(new Vec2(0, -0.625 * w)), size: new Vec2(0.25 * w, 0.75 * w) }, target)) ||
            (this.detail.downSpike && isCollision({ type: 'cube', pos: this.pos.add(new Vec2(0, 0.625 * w)), size: new Vec2(0.25 * w, 0.75 * w) }, target)))
            return 'spike';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.4 : 1;

        ctx.beginPath();
        ctx.moveTo(-0.5 * w, -0.5 * w);
        if (this.detail.upSpike) for (let i = 1; i <= 8; i++) ctx.lineTo((-0.5 + 0.125 * i) * w, (-0.5 - 0.25 * (i % 2)) * w);
        ctx.lineTo(0.5 * w, -0.5 * w);
        if (this.detail.rightSpike) for (let i = 1; i <= 8; i++) ctx.lineTo((0.5 + 0.25 * (i % 2)) * w, (-0.5 + 0.125 * i) * w);
        ctx.lineTo(0.5 * w, 0.5 * w);
        if (this.detail.downSpike) for (let i = 1; i <= 8; i++) ctx.lineTo((0.5 - 0.125 * i) * w, (0.5 + 0.25 * (i % 2)) * w);
        ctx.lineTo(-0.5 * w, 0.5 * w);
        if (this.detail.leftSpike) for (let i = 1; i <= 8; i++) ctx.lineTo((-0.5 - 0.25 * (i % 2)) * w, (0.5 - 0.125 * i) * w);
        ctx.lineTo(-0.5 * w, -0.5 * w);
        ctx.fillStyle = '#7B7B7B';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(-0.5 * w, -0.5 * w, w, w);
        ctx.fillStyle = '#9D9D9D';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects = null) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if ((constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) ||
            (this.detail.leftSpike && gridPos.x - 1 >= 0 && constant.typeLayerPairs[map[gridPos.y][gridPos.x - 1].type].isOverlap(this.layer)) ||
            (this.detail.upSpike && gridPos.y - 1 >= 0 && constant.typeLayerPairs[map[gridPos.y - 1][gridPos.x].type].isOverlap(this.layer)) ||
            (this.detail.rightSpike && gridPos.x + 1 < constant.mapSize.x && constant.typeLayerPairs[map[gridPos.y][gridPos.x + 1].type].isOverlap(this.layer)) ||
            (this.detail.downSpike && gridPos.y + 1 < constant.mapSize.y && constant.typeLayerPairs[map[gridPos.y + 1][gridPos.x].type].isOverlap(this.layer))) {
            return false;
        }
        if ((map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) ||
            (this.detail.leftSpike && gridPos.x - 1 >= 0 && map[gridPos.y][gridPos.x - 1].layer.isOverlap(this.layer)) ||
            (this.detail.upSpike && gridPos.y - 1 >= 0 && map[gridPos.y - 1][gridPos.x].layer.isOverlap(this.layer)) ||
            (this.detail.rightSpike && gridPos.x + 1 < constant.mapSize.x && map[gridPos.y][gridPos.x + 1].layer.isOverlap(this.layer)) ||
            (this.detail.downSpike && gridPos.y + 1 < constant.mapSize.y && map[gridPos.y + 1][gridPos.x].layer.isOverlap(this.layer))) {
            return false;
        }
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (this.detail.leftSpike && gridPos.x - 1 >= 0) map[gridPos.y][gridPos.x - 1].layer.add(this.layer);
        if (this.detail.upSpike && gridPos.y - 1 >= 0) map[gridPos.y - 1][gridPos.x].layer.add(this.layer);
        if (this.detail.rightSpike && gridPos.x + 1 < constant.mapSize.x) map[gridPos.y][gridPos.x + 1].layer.add(this.layer);
        if (this.detail.downSpike && gridPos.y + 1 < constant.mapSize.y) map[gridPos.y + 1][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (this.detail.leftSpike && gridPos.x - 1 >= 0) map[gridPos.y][gridPos.x - 1].layer.sub(this.layer);
        if (this.detail.upSpike && gridPos.y - 1 >= 0) map[gridPos.y - 1][gridPos.x].layer.sub(this.layer);
        if (this.detail.rightSpike && gridPos.x + 1 < constant.mapSize.x) map[gridPos.y][gridPos.x + 1].layer.sub(this.layer);
        if (this.detail.downSpike && gridPos.y + 1 < constant.mapSize.y) map[gridPos.y + 1][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}

/* 平台 */
export class platform {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'platform';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '平台'
        };

        this.loadable = false;

        this.perspective = false;

        this.layer = new Layer(1);
    }
    clone() {
        const cloneObject = new platform();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;

        this.perspective = true;
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.99 * w, 0.99 * w) }, target)) return 'platform';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        ctx.beginPath();
        ctx.moveTo(0, (-0.45) * w);
        ctx.arcTo(0.45 * w, (-0.45) * w, 0.45 * w, 0.45 * w, 0.1 * w);
        ctx.arcTo(0.45 * w, 0.45 * w, (-0.45) * w, 0.45 * w, 0.1 * w);
        ctx.arcTo((-0.45) * w, 0.45 * w, (-0.45) * w, (-0.45) * w, 0.1 * w);
        ctx.arcTo((-0.45) * w, (-0.45) * w, 0.45 * w, (-0.45) * w, 0.1 * w);
        ctx.lineTo(0, (-0.45) * w);
        ctx.fillStyle = '#ead48b';
        ctx.fill();
        ctx.strokeStyle = '#cb934d';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, (-0.35) * w);
        ctx.arcTo(0.35 * w, (-0.35) * w, 0.35 * w, 0.35 * w, 0.1 * w);
        ctx.arcTo(0.35 * w, 0.35 * w, (-0.35) * w, 0.35 * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, 0.35 * w, (-0.35) * w, (-0.35) * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, (-0.35) * w, 0.35 * w, (-0.35) * w, 0.1 * w);
        ctx.lineTo(0, (-0.35) * w);
        ctx.strokeStyle = '#f4f788';
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects = null) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        return true;
    }
    remove(map, objects = null) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
    }
}

/* 移動平台 */
export class movingPlatform {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'movingPlatform';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '移動平台(直行)',
            direction: 'up',
            distance: 1,
            speed: 'normal',
        };

        this.loadable = true;
        this.loadObject = null;

        this.lastRecord = Date.now();
        this.active = false;
        this.perspective = false;

        this.layer = new Layer(0, 1);
    }
    clone() {
        const cloneObject = new movingPlatform();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            distance: { type: 'int', min: 1, max: 15 },
            direction: { type: 'select', options: ['up', 'down', 'left', 'right'] },
            speed: { type: 'select', options: ['super slow', 'slow', 'normal', 'fast', 'super fast'] }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            distance: this.detail.distance,
            speed: this.detail.speed,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;
        this.detail.distance = objectSetting.distance;
        this.detail.speed = objectSetting.speed;

        this.perspective = true;
    }
    update(objects, map) {
        const parameters = {
            'super slow': 4000, 'slow': 2000, 'normal': 1000, 'fast': 500, 'super fast': 200,
        };
        const dirVec = Vec2.direction(this.detail.direction).mul(this.detail.distance * w);
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        if (~~((Date.now() - this.lastRecord) / parameters[this.detail.speed] / this.detail.distance) % 2 === 0) {
            this.pos = originPos.add(dirVec.mul(((Date.now() - this.lastRecord) / parameters[this.detail.speed] / this.detail.distance) % 1));
        } else {
            this.pos = originPos.add(dirVec.mul(1 - ((Date.now() - this.lastRecord) / parameters[this.detail.speed] / this.detail.distance) % 1));
        }
        if (this.loadObject) this.loadObject.object.pos = this.pos;
        return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.9 * w, 0.9 * w) }, target)) return 'movingPlatform';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        if (this.active) ctx.translate(originPos.x, originPos.y);
        else ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        if (layer === -1 || layer === 0) {
            ctx.save();
            let dir = this.detail.direction;
            ctx.rotate((dir === 'up') ? 0 : (dir === 'down') ? Math.PI : (dir === 'left') ? 1.5 * Math.PI : 0.5 * Math.PI);

            ctx.beginPath();
            ctx.rect(-0.1 * w, -0.1 * w, 0.2 * w, 0.2 * w);
            ctx.fillStyle = '#4F4F4F';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, - this.detail.distance * w);
            ctx.strokeStyle = '#4F4F4F';
            ctx.stroke();
            ctx.closePath();

            ctx.save();
            ctx.translate(0, - this.detail.distance * w);
            ctx.beginPath();
            ctx.rect(-0.1 * w, -0.1 * w, 0.2 * w, 0.2 * w);
            ctx.fillStyle = '#4F4F4F';
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            ctx.restore();
        }

        if (layer === -1 || layer === 1) {
            if (this.active) {
                const relativePos = this.pos.sub(originPos);
                ctx.translate(relativePos.x, relativePos.y);
            }

            ctx.beginPath();
            ctx.moveTo(0, (-0.45) * w);
            ctx.arcTo(0.45 * w, (-0.45) * w, 0.45 * w, 0.45 * w, 0.1 * w);
            ctx.arcTo(0.45 * w, 0.45 * w, (-0.45) * w, 0.45 * w, 0.1 * w);
            ctx.arcTo((-0.45) * w, 0.45 * w, (-0.45) * w, (-0.45) * w, 0.1 * w);
            ctx.arcTo((-0.45) * w, (-0.45) * w, 0.45 * w, (-0.45) * w, 0.1 * w);
            ctx.lineTo(0, (-0.45) * w);
            ctx.fillStyle = '#ead48b';
            ctx.fill();
            ctx.strokeStyle = '#cb934d';
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0, (-0.35) * w);
            ctx.arcTo(0.35 * w, (-0.35) * w, 0.35 * w, 0.35 * w, 0.1 * w);
            ctx.arcTo(0.35 * w, 0.35 * w, (-0.35) * w, 0.35 * w, 0.1 * w);
            ctx.arcTo((-0.35) * w, 0.35 * w, (-0.35) * w, (-0.35) * w, 0.1 * w);
            ctx.arcTo((-0.35) * w, (-0.35) * w, 0.35 * w, (-0.35) * w, 0.1 * w);
            ctx.lineTo(0, (-0.35) * w);
            ctx.strokeStyle = '#f4f788';
            ctx.stroke();
            ctx.closePath();
        }

        ctx.restore();
    }
    place(map, objects) {
        this.active = true;
        this.lastRecord = Date.now();
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    this.loadObject = {
                        id: objects[i].id,
                        object: objects[i],
                    };
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        this.active = false;
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
    }
}

/* 弓 */
export class bow {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'bow';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '弓箭座',
            direction: 'up',
            RoF: 'normal'
        };

        this.loadable = false;

        this.lastFire = Date.now();
        this.lifeCycle = 0;
        this.active = false;
        this.perspective = false;

        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new bow();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            direction: { type: 'select', options: ['up', 'down', 'left', 'right'] },
            RoF: { type: 'select', options: ['super slow', 'slow', 'normal', 'fast', 'super fast'] }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            RoF: this.detail.RoF,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;
        this.detail.RoF = objectSetting.RoF;

        this.perspective = true;
    }
    update(objects, map) {
        const parameters = {
            'super slow': 8000, slow: 5000, normal: 3000, fast: 1000, 'super fast': 500
        }
        this.lifeCycle = (this.active) ? (Date.now() - this.lastFire) / parameters[this.detail.RoF] : 0;
        this.lifeCycle = (this.lifeCycle > 0.5) ? (this.lifeCycle - 0.5) / 0.5 : 0;
        if (Date.now() > this.lastFire + parameters[this.detail.RoF]) {
            this.lastFire = Date.now();
            let dirVec = Vec2.direction(this.detail.direction).mul(0.5 * w);
            const result = {
                type: 'produce',
                object: new arrow(this.pos.add(dirVec)),
            };
            result.object.detail.direction = this.detail.direction;
            return result;
        } else return { type: 'none' };
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;
        let dir = this.detail.direction;
        ctx.rotate((dir === 'up') ? 0 : (dir === 'down') ? Math.PI : (dir === 'left') ? 1.5 * Math.PI : 0.5 * Math.PI);

        const drawPoint = (new Vec2(0, 0.05)).add((new Vec2(0, 0.35)).mul(this.lifeCycle));

        if (this.lifeCycle > 0) {
            let tempArrow = new arrow(drawPoint.mul(w).sub(new Vec2(0, 0.9 * w)));
            tempArrow.draw(ctx);
        }

        ctx.beginPath();
        ctx.moveTo(-0.45 * w, 0.05 * w);
        ctx.lineTo(drawPoint.x * w, drawPoint.y * w);
        ctx.lineTo(0.45 * w, 0.05 * w);
        ctx.strokeStyle = '#9D9D9D';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(0, 0.2 * w, 0.45 * w, -0.95 * Math.PI, -0.05 * Math.PI);
        ctx.arc(0, 0.2 * w, 0.55 * w, -0.05 * Math.PI, -0.95 * Math.PI, true);
        ctx.arc(0, 0.2 * w, 0.45 * w, -0.95 * Math.PI, -0.95 * Math.PI);
        ctx.fillStyle = '#D26900';
        ctx.fill();
        ctx.strokeStyle = '#272727';
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects = null) {
        this.active = true;
        this.lastFire = Date.now();
        this.lifeCycle = 0;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        this.active = false;
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}

/* 箭 */
export class arrow {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'arrow';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = new Vec2(-1, -1);

        this.detail = {
            name: '箭',
            direction: 'up',
        };

        this.loadable = false;

        this.perspective = false;

        this.speed = 3;
        this.lastRecord = Date.now();
        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new arrow();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    update(objects, map) {
        if (!this.pos.between(constant.mapStart, constant.mapStart.add(constant.mapSize.mul(w)))) return { type: 'destory' };
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].type !== 'ice' && objects[i].type !== 'portal' && objects[i].type !== 'woodenBox' && objects[i].type !== 'magnet' && objects[i].type !== 'block' && objects[i].type !== 'lockedWall') continue;
            if (objects[i].id !== this.id && objects[i].collision) {
                let result = objects[i].collision({ type: 'sphere', pos: this.pos, r: 0.1 });
                // console.log(result);
                if (result === 'ice') this.speed *= 1.03;
                // else if (result === 'conveyor') this.detail.direction = objects[i].detail.direction;
                else if (result === 'portal') this.pos = objects[i].teleport(objects);
                // else if (result === 'missileRay') objects[i].fire(this);
                else if (result === 'woodenBox') {
                    //objects[i].push(objects, map, this.pos);
                    return { type: 'destory' };
                }
                else if (result === 'magneticField') this.pos = this.pos.add(objects[i].getDisplacement());
                // else if (result === 'unlocker') objects[i].unlock(objects);
                else if (result === 'block' || result === 'lockedWall') return { type: 'destory' };
            }
        }
        let dirVec = Vec2.direction(this.detail.direction).mul(this.speed * w);
        this.pos = this.pos.add(dirVec.mul((Date.now() - this.lastRecord) / 1000));
        this.lastRecord = Date.now();
        return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'sphere', pos: this.pos, r: 0.1 }, target)) return 'arrow';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.9 : 1;
        let dir = this.detail.direction;
        ctx.rotate((dir === 'up') ? 0 : (dir === 'down') ? Math.PI : (dir === 'left') ? 1.5 * Math.PI : 0.5 * Math.PI);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0.12 * w, 0.2 * w);
        ctx.lineTo(-0.12 * w, 0.2 * w);
        ctx.lineTo(0, 0);
        ctx.fillStyle = '#FCFCFC';
        ctx.fill();
        ctx.strokeStyle = '#9D9D9D';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, 0.2 * w);
        ctx.lineTo(0, 0.8 * w);
        ctx.strokeStyle = '#AD5A5A';
        ctx.stroke();
        ctx.closePath();

        ctx.translate(0, 0.8 * w);
        for (let i = 0; i < 2; i++) {
            if (i === 1) ctx.scale(-1, 1);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0.12 * w, 0.06 * w);
            ctx.lineTo(0.12 * w, 0.18 * w);
            ctx.lineTo(0, 0.12 * w);
            ctx.lineTo(0, 0);
            ctx.fillStyle = '#00DB00';
            ctx.fill();
            ctx.strokeStyle = '#9D9D9D';
            ctx.stroke();
            ctx.closePath();
        }

        ctx.restore();
    }
}

/* 黏液 */
export class mucus {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'mucus';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '黏液'
        };

        this.loadable = true;
        this.loadObject = null;

        this.perspective = false;

        this.layer = new Layer(2);
    }
    clone() {
        const cloneObject = new mucus();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;

        this.perspective = true;
    }
    update(objects, map) {
        if (this.loadObject) this.loadObject.object.pos = this.pos.clone();
        return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.7 * w, 0.7 * w) }, target)) return 'mucus';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        ctx.beginPath();
        ctx.moveTo(0, (-0.35) * w);
        ctx.arcTo(0.35 * w, (-0.35) * w, 0.35 * w, 0.35 * w, 0.1 * w);
        ctx.arcTo(0.35 * w, 0.35 * w, (-0.35) * w, 0.35 * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, 0.35 * w, (-0.35) * w, (-0.35) * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, (-0.35) * w, 0.35 * w, (-0.35) * w, 0.1 * w);
        ctx.lineTo(0, (-0.35) * w);
        let grd = ctx.createLinearGradient(-0.4 * w, -0.4 * w, 0.4 * w, 0.4 * w);
        grd.addColorStop(0, '#B7FF4A');
        grd.addColorStop(0.4, '#FFDC35');
        grd.addColorStop(0.6, '#FFDC35');
        grd.addColorStop(1, '#B7FF4A');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.strokeStyle = '#E1E100';
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[1]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 1) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        if (map[gridPos.y][gridPos.x].layer.status[3]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 3) {
                    this.loadObject = {
                        id: objects[i].id,
                        object: objects[i],
                    };
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[1]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 1) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
        if (this.loadObject) this.loadObject = null;
    }
}

/* 音鈸 */
export class cymbal {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'cymbal';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '音鈸',
            RoF: 'normal',
            range: 'normal',
        };

        this.loadable = false;

        this.lastFire = Date.now();
        this.lifeCycle = 0;
        this.active = false;
        this.perspective = false;

        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new cymbal();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            RoF: { type: 'select', options: ['slow', 'normal', 'fast'] },
            range: { type: 'select', options: ['small', 'normal', 'large'] },
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            RoF: this.detail.RoF,
            range: this.detail.range,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;
        this.detail.RoF = objectSetting.RoF;
        this.detail.range = objectSetting.range;

        this.perspective = true;
    }
    update(objects, map) {
        const parameters = {
            slow: 12000, normal: 8000, fast: 4000
        }
        this.lifeCycle = (this.active) ? (Date.now() - this.lastFire) / parameters[this.detail.RoF] : 0;
        this.lifeCycle = Math.min(1, this.lifeCycle);
        if (Date.now() > this.lastFire + parameters[this.detail.RoF]) {
            this.lastFire = Date.now();
            const result = {
                type: 'produce',
                object: new cymbalWave(this.pos),
            };
            result.object.r = 0.4 * w;
            result.object.detail.range = this.detail.range;
            return result;
        } else return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'sphere', pos: this.pos, r: 0.48 * w }, target)) return 'cymbal';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        const parameters = {
            slow: 12000, normal: 8000, fast: 4000
        }
        let pivot = 0.96 + parameters[this.detail.RoF] * 0.0000025;
        let r = (this.lifeCycle < pivot) ? 0.05 + 0.4 * this.lifeCycle / pivot : 0.05 + 0.4 * (1 - this.lifeCycle) / (1 - pivot);

        ctx.save();
        ctx.rotate(this.lifeCycle * 8 * Math.PI);
        ctx.beginPath();
        ctx.arc(0, 0, 0.48 * w, 0, 2 * Math.PI);
        var grd = ctx.createRadialGradient(-0.13 * w, -0.13 * w, 0, 0, 0, 0.48 * w);
        grd.addColorStop(0, 'white');
        grd.addColorStop(1, '#D6D6AD');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.strokeStyle = '#B9B973';
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        ctx.save();

        ctx.globalAlpha *= 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 0.4 * w, 0 * Math.PI, 2 * Math.PI);
        ctx.strokeStyle = '#CDCD9A';
        ctx.stroke();
        ctx.closePath();

        ctx.restore();

        ctx.beginPath();
        ctx.globalAlpha *= 0.5;
        ctx.arc(0, 0, r * w, 0, 2 * Math.PI);
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(0, 0, 0.06 * w, 0, 2 * Math.PI);
        ctx.fillStyle = '#EAC100';
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects = null) {
        this.active = true;
        this.lastFire = Date.now();
        this.lifeCycle = 0;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        this.active = false;
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}

/* 音波 */
export class cymbalWave {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'cymbalWave';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = new Vec2(-1, -1);

        this.detail = {
            name: '音波',
            range: 'normal',
        };

        this.loadable = false;

        this.perspective = false;

        this.r = 0;
        this.lastRecord = Date.now();
        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new arrow();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    update(objects, map) {
        const parameters = {
            small: 1.5, normal: 2.5, large: 3.5
        }
        if (this.r > w * parameters[this.detail.range]) return { type: 'destory' };
        this.r = 0.4 * w + 0.5 * w * (Date.now() - this.lastRecord) / 1000;
        return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'sphere', pos: this.pos, r: this.r }, target)) return 'cymbalWave';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);

        const parameters = {
            small: 1.5, normal: 2.5, large: 3.5
        }
        ctx.globalAlpha = 0.3 * Math.max((1.1 - Math.pow(this.r / (w * parameters[this.detail.range]), 16)), 0);

        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
        var grd = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r);
        grd.addColorStop(0, 'white');
        grd.addColorStop(0.4, 'white');
        grd.addColorStop(0.95, '#FFFF37');
        grd.addColorStop(1, '#E1E100');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }
}

/* 冰面 */
export class ice {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'ice';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '冰層'
        };

        this.loadable = false;

        this.perspective = false;

        this.layer = new Layer(2);
    }
    clone() {
        const cloneObject = new ice();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;

        this.perspective = true;
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.7 * w, 0.7 * w) }, target)) return 'ice';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        ctx.beginPath();
        ctx.moveTo(0, (-0.35) * w);
        ctx.arcTo(0.35 * w, (-0.35) * w, 0.35 * w, 0.35 * w, 0.1 * w);
        ctx.arcTo(0.35 * w, 0.35 * w, (-0.35) * w, 0.35 * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, 0.35 * w, (-0.35) * w, (-0.35) * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, (-0.35) * w, 0.35 * w, (-0.35) * w, 0.1 * w);
        ctx.lineTo(0, (-0.35) * w);
        let grd = ctx.createLinearGradient(-0.4 * w, -0.4 * w, 0.4 * w, 0.4 * w);
        grd.addColorStop(0, '#CAFFFF');
        grd.addColorStop(0.12, 'white');
        grd.addColorStop(0.15, 'white');
        grd.addColorStop(0.4, '#CAFFFF');
        grd.addColorStop(0.6, '#CAFFFF');
        grd.addColorStop(0.85, 'white');
        grd.addColorStop(0.88, 'white');
        grd.addColorStop(1, '#CAFFFF');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.strokeStyle = '#ACD6FF';
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[1]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 1) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[1]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 1) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}

/* 傳輸帶 */
export class conveyor {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'conveyor';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '傳輸帶',
            direction: 'right',
        };

        this.loadable = false;

        this.perspective = false;

        this.layer = new Layer(2);
    }
    clone() {
        const cloneObject = new conveyor();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            direction: { type: 'select', options: ['up', 'down', 'left', 'right'] },
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;

        this.perspective = true;
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.7 * w, 0.7 * w) }, target)) return 'conveyor';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        ctx.beginPath();
        ctx.moveTo(0, (-0.35) * w);
        ctx.arcTo(0.35 * w, (-0.35) * w, 0.35 * w, 0.35 * w, 0.1 * w);
        ctx.arcTo(0.35 * w, 0.35 * w, (-0.35) * w, 0.35 * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, 0.35 * w, (-0.35) * w, (-0.35) * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, (-0.35) * w, 0.35 * w, (-0.35) * w, 0.1 * w);
        ctx.lineTo(0, (-0.35) * w);
        ctx.fillStyle = '#BE77FF';
        ctx.fill();
        ctx.strokeStyle = '#9F35FF';
        ctx.stroke();
        ctx.closePath();

        ctx.rect((-0.34) * w, (-0.34) * w, 0.68 * w, 0.68 * w);
        ctx.clip();

        let dir = this.detail.direction;
        ctx.rotate((dir === 'right') ? 0 : (dir === 'left') ? Math.PI : (dir === 'up') ? 1.5 * Math.PI : 0.5 * Math.PI);

        ctx.beginPath();
        ctx.moveTo(-0.4 * w, -0.15 * w);
        ctx.lineTo(-0.05 * w, -0.15 * w);
        ctx.lineTo(-0.05 * w, -0.4 * w);
        ctx.lineTo(0.4 * w, 0);
        ctx.lineTo(-0.05 * w, 0.4 * w);
        ctx.lineTo(-0.05 * w, 0.15 * w);
        ctx.lineTo(-0.4 * w, 0.15 * w);
        ctx.lineTo(-0.4 * w, -0.15 * w);
        ctx.fillStyle = '#FFA6FF';
        ctx.fill();
        ctx.strokeStyle = '#D3A4FF';
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[1]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 1) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[1]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 1) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}

/* 傳送門 */
export class portal {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'portal';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '傳送門'
        };

        this.loadable = false;

        this.open = false;
        this.index = -1;

        this.cooldown = false;
        this.lastClose = 0;
        this.cooldownTime = 2989;
        this.cooldownCycle = 0;

        this.perspective = false;

        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new portal();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,

            index: this.index,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;

        this.index = objectSetting.index;

        this.perspective = true;
    }
    update(objects, map) {
        if (this.cooldown) {
            if (Date.now() > this.lastClose + this.cooldownTime) {
                this.cooldown = false;
                this.open = true;
            } else this.cooldownCycle = (Date.now() - this.lastClose) / this.cooldownTime;
        }
        return { type: 'none' };
    }
    collision(target) {
        if (this.open && isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.6 * w, 0.6 * w) }, target)) return 'portal';
        return 'none';
    }
    teleport(objects) {
        this.open = false;
        this.cooldown = true;
        this.lastClose = Date.now();
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].type === 'portal' && objects[i].index === this.index && objects[i].id !== this.id) {
                objects[i].open = false;
                objects[i].cooldown = true;
                objects[i].lastClose = Date.now();
                return objects[i].pos.clone();
            }
        }
        return this.pos.clone();
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        ctx.beginPath();
        ctx.rect(-0.36 * w, -0.36 * w, 0.72 * w, 0.72 * w);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#4B0091';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(-0.4 * w, -0.4 * w, 0.8 * w, 0.8 * w);
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(-0.32 * w, -0.32 * w, 0.64 * w, 0.64 * w);
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        ctx.rect(-0.3 * w, -0.3 * w, 0.6 * w, 0.6 * w);
        ctx.clip();
        ctx.globalAlpha = (this.open) ? 0.95 :
            (!this.cooldown) ? 0.2 :
                (this.cooldownCycle < 0.1) ? 0.2 + 0.75 * (1 - this.cooldownCycle * 10) :
                    (this.cooldownCycle > 0.9) ? 0.2 + 0.75 * (1 - (1 - this.cooldownCycle) * 10) : 0.2;

        ctx.beginPath();
        ctx.rect(-0.32 * w, -0.32 * w, 0.64 * w, 0.64 * w);
        let color = ((this.open || this.cooldown) && (this.index >= 0)) ? colorList[this.index] : 'white';
        let grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 0.4 * w);
        grd.addColorStop(0, color);
        grd.addColorStop(0.15, '#3C3C3C');
        grd.addColorStop(0.3, color);
        grd.addColorStop(0.45, '#3C3C3C');
        grd.addColorStop(0.6, color);
        grd.addColorStop(0.75, '#3C3C3C');
        grd.addColorStop(0.9, color);
        grd.addColorStop(1, '#3C3C3C');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.closePath();


        ctx.restore();
    }
    place(map, objects = null) {
        this.cooldown = false;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        if (this.index === -1) {
            let usedIndex = [0, 0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].type === 'portal') {
                    usedIndex[objects[i].index] += 1;
                }
            }
            for (let i = 0; i < usedIndex.length; i++) {
                if (usedIndex[i] === 1) {
                    this.index = i;
                    this.open = true;
                    for (let j = 0; j < objects.length; j++) {
                        if (objects[j].type === 'portal' && objects[j].index === i) {
                            objects[j].open = true;
                        }
                    }
                    break;
                }
            }
            if (this.index === -1) {
                for (let i = 0; i < usedIndex.length; i++) {
                    if (usedIndex[i] === 0) {
                        this.index = i;
                        this.open = false;
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].type === 'portal' && objects[i].index === this.index && objects[i].id != this.id) {
                    objects[i].open = true;
                    this.open = true;
                }
            }
        }
        if (this.index === -1) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].type === 'portal' && objects[i].index === this.index && objects[i].id != this.id) {
                objects[i].cooldown = false;
                objects[i].open = false;
                break;
            }
        }
        this.index = -1;
        this.open = false;
        this.cooldown = false;
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}

/* 陷阱平台 */
export class trapPlatform {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'trapPlatform';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '陷阱平台',
            duration: 'normal',
        };

        this.loadable = false;

        this.open = false;
        this.lastChange = Date.now();
        this.openCycle = 0;

        this.perspective = false;

        this.layer = new Layer(1, 2);
    }
    clone() {
        const cloneObject = new trapPlatform();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            duration: { type: 'select', options: ['short', 'normal', 'long'] },
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            duration: this.detail.duration,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.duration = objectSetting.duration;

        this.perspective = true;
    }
    update(objects, map) {
        const parameters = {
            short: 3000, normal: 6000, long: 9000
        }
        if (this.open) {
            this.openCycle = (Date.now() - this.lastChange) / parameters[this.detail.duration];
            this.openCycle = (this.openCycle < 0.1 * 6000 / parameters[this.detail.duration]) ? this.openCycle / (0.1 * 6000 / parameters[this.detail.duration]) :
                (this.openCycle > 1 - (0.1 * 6000 / parameters[this.detail.duration])) ? (1 - this.openCycle) / (0.1 * 6000 / parameters[this.detail.duration]) : 1;
            if (Date.now() > this.lastChange + parameters[this.detail.duration]) {
                this.open = false;
                this.lastChange = Date.now();
            }
        } else {
            this.openCycle = 0;
            if (Date.now() > this.lastChange + parameters[this.detail.duration]) {
                this.open = true;
                this.lastChange = Date.now();
            }
        }
        return { type: 'none' };
    }
    collision(target) {
        if (this.open && isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.6 * w * this.openCycle, 0.7 * w) }, target)) return 'trap';
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.9 * w, 0.9 * w) }, target)) return 'platform';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.6 : 1;

        ctx.beginPath();
        ctx.rect(-0.39 * w, -0.39 * w, 0.78 * w, 0.78 * w);
        ctx.strokeStyle = '#ADADAD';
        ctx.stroke();
        ctx.closePath();

        for (let i = 0; i < 2; i++) {
            ctx.save();

            if (this.open) {
                let p = (i === 0) ? -1 : 1;
                ctx.beginPath();
                ctx.moveTo(-0.05 * w + p * (0.3 * w) * this.openCycle, -0.35 * w);
                ctx.lineTo(0.05 * w + p * (0.3 * w) * this.openCycle, -0.25 * w);
                ctx.lineTo(-0.05 * w + p * (0.3 * w) * this.openCycle, -0.15 * w);
                ctx.lineTo(0.05 * w + p * (0.3 * w) * this.openCycle, -0.05 * w);
                ctx.lineTo(-0.05 * w + p * (0.3 * w) * this.openCycle, 0.05 * w);
                ctx.lineTo(0.05 * w + p * (0.3 * w) * this.openCycle, 0.15 * w);
                ctx.lineTo(-0.05 * w + p * (0.3 * w) * this.openCycle, 0.25 * w);
                ctx.lineTo(0.05 * w + p * (0.3 * w) * this.openCycle, 0.35 * w);
                ctx.lineTo(0.35 * w * p, 0.35 * w);
                ctx.lineTo(0.35 * w * p, -0.35 * w);
                ctx.lineTo(-0.05 * w + p * (0.3 * w) * this.openCycle, -0.35 * w);
                ctx.clip();
                ctx.closePath();
            }
            ctx.beginPath();
            ctx.rect(-0.35 * w, -0.35 * w, 0.7 * w, 0.7 * w);
            ctx.fillStyle = '#E0E0E0';
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }

        ctx.beginPath();
        ctx.rect(-0.43 * w, -0.43 * w, 0.86 * w, 0.86 * w);
        ctx.strokeStyle = '#3C3C3C';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(-0.35 * w, -0.35 * w, 0.7 * w, 0.7 * w);
        ctx.strokeStyle = '#3C3C3C';
        ctx.stroke();
        ctx.closePath();

        for (let i = 0; i < 2; i++) {
            ctx.save();
            if (this.open) {
                if (i === 0) ctx.translate((-0.3 * w) * this.openCycle, 0);
                else ctx.translate((0.3 * w) * this.openCycle, 0);
            }
            ctx.beginPath();
            ctx.moveTo(-0.05 * w, -0.35 * w);
            ctx.lineTo(0.05 * w, -0.25 * w);
            ctx.lineTo(-0.05 * w, -0.15 * w);
            ctx.lineTo(0.05 * w, -0.05 * w);
            ctx.lineTo(-0.05 * w, 0.05 * w);
            ctx.lineTo(0.05 * w, 0.15 * w);
            ctx.lineTo(-0.05 * w, 0.25 * w);
            ctx.lineTo(0.05 * w, 0.35 * w);
            ctx.strokeStyle = '#6C6C6C';
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }

        ctx.restore();
    }
    place(map, objects = null) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        return true;
    }
    remove(map, objects = null) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
    }
}

/* 追蹤導彈座 */
export class missileBase {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'missileBase';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '追蹤導彈發射台',
            direction: 'up',
            rotate: true,
        };

        this.loadable = false;

        this.active = false;

        this.r = 2.5;
        this.range = 0.125;
        this.lastFire = Date.now();
        this.unfoldTime = 500;
        this.unfoldCycle = 0;
        this.rotateSpeed = 0.2; // 1秒幾圈
        this.rotateCycle = 0;
        this.find = false;
        this.findTarget = null;
        this.lastFind = 0;
        this.findCycle = 0;
        this.findTime = 2500;

        this.perspective = false;

        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new missileBase();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            direction: { type: 'select', options: ['up', 'down', 'left', 'right'] },
            rotate: { type: 'check' },
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            rotate: this.detail.rotate,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;
        this.detail.rotate = objectSetting.rotate;

        this.perspective = true;
    }
    update(objects, map) {
        this.unfoldCycle = (Date.now() - this.lastFire) / this.unfoldTime;
        this.unfoldCycle = (this.unfoldCycle > 1) ? 1 : this.unfoldCycle;
        this.rotateCycle = (this.unfoldCycle === 1 && this.detail.rotate) ? (Date.now() - this.lastFire - this.unfoldTime) / 1000 * this.rotateSpeed : 0;
        if (this.find) this.findCycle = (Date.now() - this.lastFind) / this.findTime;
        if (this.findCycle >= 1) {
            this.find = false;
            this.findCycle = 0;
            this.lastFire = Date.now();
            const result = {
                type: 'produce',
                object: new missile(this.pos),
            };
            result.object.target = this.findTarget;
            return result;
        }
        return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'sphere', pos: this.pos, r: 0.35 * w }, target)) return 'missileBase';
        if (!this.find && isCollision({ type: 'sphere', pos: this.pos, r: 2.5 * w }, target)) {
            const parameters = {
                up: 1.5, down: 0.5, left: 1, right: 0,
            }
            let radian = target.pos.sub(this.pos).radian();
            let minRadian = ((parameters[this.detail.direction] + 2 * this.rotateCycle - this.range * this.unfoldCycle) * Math.PI) % (2 * Math.PI);
            let maxRadian = ((parameters[this.detail.direction] + 2 * this.rotateCycle + this.range * this.unfoldCycle) * Math.PI) % (2 * Math.PI);
            if (maxRadian < minRadian) {
                maxRadian += 2 * Math.PI;
                if (radian < Math.PI) radian += 2 * Math.PI;
            }
            if (radian >= minRadian && radian <= maxRadian) return 'missileRay';
        }
        return 'none';
    }
    fire(target) {
        this.find = true;
        this.findTarget = target;
        this.lastFind = Date.now();
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        ctx.beginPath();
        let unit = 0.7 * w / (1 + Math.sqrt(2));
        ctx.moveTo(-0.5 * unit, -(0.5 + Math.sqrt(0.5)) * unit);
        ctx.lineTo(0.5 * unit, -(0.5 + Math.sqrt(0.5)) * unit);
        ctx.lineTo((0.5 + Math.sqrt(0.5)) * unit, -0.5 * unit);
        ctx.lineTo((0.5 + Math.sqrt(0.5)) * unit, 0.5 * unit);
        ctx.lineTo(0.5 * unit, (0.5 + Math.sqrt(0.5)) * unit);
        ctx.lineTo(-0.5 * unit, (0.5 + Math.sqrt(0.5)) * unit);
        ctx.lineTo(-(0.5 + Math.sqrt(0.5)) * unit, 0.5 * unit);
        ctx.lineTo(-(0.5 + Math.sqrt(0.5)) * unit, -0.5 * unit);
        ctx.lineTo(-0.5 * unit, -(0.5 + Math.sqrt(0.5)) * unit);
        let grd = ctx.createRadialGradient(-0.1 * w, -0.1 * w, 1, 0, 0, 0.35 * w);
        grd.addColorStop(0, 'white');
        grd.addColorStop(1, '#AAAAFF');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.strokeStyle = '#7D7DFF';
        ctx.stroke();
        ctx.closePath();

        ctx.globalAlpha *= 0.6;
        ctx.beginPath();
        ctx.arc(0, 0, 0.1 * w, 0, 2 * Math.PI);
        grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 0.1 * w);
        grd.addColorStop(0, 'white');
        grd.addColorStop(0.4, '#FF2D2D');
        grd.addColorStop(1, '#FF2D2D');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.strokeStyle = '#FF2D2D';
        ctx.stroke();
        ctx.closePath();

        if (this.active) {
            grd = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * w);
            grd.addColorStop(0, 'white');
            grd.addColorStop(0.6, '#FF5151');
            grd.addColorStop(1, '#FF0000');
            if (!this.find) {
                ctx.beginPath();
                const parameters = {
                    up: 1.5, down: 0.5, left: 1, right: 0,
                }
                ctx.arc(0, 0, this.r * w, (parameters[this.detail.direction] + 2 * this.rotateCycle - this.range * this.unfoldCycle) * Math.PI,
                    (parameters[this.detail.direction] + 2 * this.rotateCycle + this.range * this.unfoldCycle) * Math.PI);
                ctx.lineTo(0, 0);
                ctx.fillStyle = grd;
                ctx.fill();
                ctx.closePath();
            } else {
                ctx.globalAlpha *= 0.4 * ((this.findCycle * 6) % 1);
                ctx.beginPath();
                ctx.arc(0, 0, this.r * w, 0, 2 * Math.PI);
                ctx.fillStyle = grd;
                ctx.fill();
                ctx.closePath();
            }
        }

        ctx.restore();
    }
    place(map, objects = null) {
        this.active = true;
        this.lastFire = Date.now();
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        this.active = false;
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}

/* 追蹤導彈 */
export class missile {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'missile';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = new Vec2(-1, -1);

        this.detail = {
            name: '追蹤導彈',
        };

        this.loadable = false;

        this.perspective = false;

        this.target = null;
        this.dirVec = new Vec2(0, 0);
        this.speed = 2;
        this.lastRecord = Date.now();
        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new missile();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    update(objects, map) {
        if (!this.pos.between(constant.mapStart, constant.mapStart.add(constant.mapSize.mul(w)))) return { type: 'destory' };
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].id !== this.id && objects[i].collision) {
                let result = objects[i].collision({ type: 'sphere', pos: this.pos, r: 0.1 });
                if (result === 'ice') this.speed *= 1.01;
                else if (result === 'portal') this.pos = objects[i].teleport(objects);
                else if (result === 'arrow') return { type: 'destory' };
                else if (result === 'cymbalWave') return { type: 'destory' };
                else if (result === 'missile') return { type: 'destory' };
                else if (result === 'block') return { type: 'destory' };
                else if (result === 'lockedWall') return { type: 'destory' };
                else if (result === 'woodenBox') {
                    objects[i].push(objects, map, this.pos);
                    return { type: 'destory' };
                }
                else if (result === 'magneticField') this.pos = this.pos.add(objects[i].getDisplacement());
            }
        }
        this.dirVec = this.target.pos.sub(this.pos).unit();
        this.pos = this.pos.add(this.dirVec.mul(this.speed * w * (Date.now() - this.lastRecord) / 1000));
        this.lastRecord = Date.now();
        return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'sphere', pos: this.pos, r: 0.2 * w }, target)) return 'missile';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.9 : 1;
        ctx.rotate(this.dirVec.radian() + 0.5 * Math.PI);

        for (let i = 0; i < 2; i++) {
            let p = (i === 0) ? -1 : 1;
            ctx.beginPath();
            ctx.moveTo(0.164 * w * p, 0.2 * w);
            ctx.lineTo(0.3 * w * p, 0.3 * w);
            ctx.lineTo(0.3 * w * p, 0.45 * w);
            ctx.lineTo(0.128 * w * p, 0.4 * w);
            ctx.fillStyle = '#F0F0F0';
            ctx.fill();
            ctx.strokeStyle = '#C0C0C0';
            ctx.stroke();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.moveTo(-0.1 * w, 0.5 * w);
        ctx.lineTo(-0.14 * w, 0.64 * w + 0.06 * w * Math.random());
        ctx.lineTo(-0.03 * w, 0.56 * w);
        ctx.lineTo(0 * w, 0.6 * w + 0.06 * w * Math.random());
        ctx.lineTo(0.03 * w, 0.56 * w);
        ctx.lineTo(0.14 * w, 0.64 * w + 0.06 * w * Math.random());
        ctx.lineTo(0.1 * w, 0.5 * w);
        ctx.fillStyle = '#FF9224';
        ctx.fill();
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 0.2 * w, 0, Math.PI, true);
        ctx.lineTo(-0.11 * w, 0.5 * w);
        ctx.lineTo(0.11 * w, 0.5 * w);
        ctx.lineTo(0.2 * w, 0);
        ctx.fillStyle = '#F0F0F0';
        ctx.fill();
        ctx.strokeStyle = '#C0C0C0';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(-0.195 * w, 0);
        ctx.lineTo(0.195 * w, 0);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(-0.186 * w, 0.05 * w);
        ctx.lineTo(0.186 * w, 0.05 * w);
        ctx.strokeStyle = 'red';
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
}

/* 鎖牆 */
export class lockedWall {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'lockedWall';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '上鎖的牆',
            direction: 'horizontal',
        };

        this.loadable = false;

        this.perspective = false;

        this.locked = true;
        this.index = -1;

        this.layer = new Layer(2, 3);
    }
    clone() {
        const cloneObject = new lockedWall();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            direction: { type: 'select', options: ['horizontal', 'vertical'] },
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            direction: this.detail.direction,

            index: this.index,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;

        this.index = objectSetting.index;

        this.perspective = true;
    }
    collision(target) {
        const parameters = {
            horizontal: new Vec2(w, 0.4 * w), vertical: new Vec2(0.4 * w, w),
        };
        if (this.locked && isCollision({ type: 'cube', pos: this.pos, size: parameters[this.detail.direction] }, target)) return 'lockedWall';
        return 'none';
    }
    draw(ctx, layer = -1) {
        if (!this.locked) return;

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.6 : 1;
        if (this.detail.direction === 'vertical') ctx.rotate(0.5 * Math.PI);

        ctx.beginPath();
        ctx.rect(-0.5 * w, -0.1 * w, w, 0.2 * w);
        ctx.fillStyle = '#9D9D9D';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 0.2 * w, 0, 2 * Math.PI);
        ctx.fillStyle = (this.index >= 0) ? colorList[this.index] : 'white';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -0.06 * w, 0.08 * w, 0.375 * Math.PI, 0.625 * Math.PI, true);
        ctx.lineTo(-0.04 * w, 0.13 * w);
        ctx.lineTo(0.04 * w, 0.13 * w);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects = null) {
        if (this.index === -1) {
            let usedIndex = [0, 0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].type === 'unlocker') usedIndex[objects[i].index] = Math.max(1, usedIndex[objects[i].index]);
                if (objects[i].type === 'lockedWall') usedIndex[objects[i].index] = 2;
            }
            for (let i = 0; i < usedIndex.length; i++) {
                if (usedIndex[i] === 1) {
                    this.index = i;
                    break;
                }
            }
            if (this.index === -1) {
                for (let i = 0; i < usedIndex.length; i++) {
                    if (usedIndex[i] === 0) {
                        this.index = i;
                        break;
                    }
                }
            }
        }
        if (this.index === -1) return false;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        return true;
    }
    remove(map, objects = null) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
    }
}

/* 鑰匙 */
export class unlocker {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'unlocker';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '鑰匙'
        };

        this.loadable = false;

        this.perspective = false;

        this.used = false;
        this.index = -1;

        this.layer = new Layer(4);
    }
    clone() {
        const cloneObject = new unlocker();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,

            index: this.index,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;

        this.index = objectSetting.index;

        this.perspective = true;
    }
    collision(target) {
        if (!this.used && isCollision({ type: 'sphere', pos: this.pos, r: 0.35 * w }, target)) return 'unlocker';
        return 'none';
    }
    unlock(objects) {
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].type === 'lockedWall' && objects[i].index === this.index) {
                objects[i].locked = false;
                this.used = true;
            }
        }
    }
    draw(ctx, layer = -1) {
        if (this.used) return;

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;
        ctx.rotate(0.25 * Math.PI);

        ctx.beginPath();
        ctx.arc(0, -0.25 * w, 0.2 * w, 0.4 * Math.PI, 0.6 * Math.PI, true);
        ctx.lineTo(-0.06 * w, 0.4 * w);
        ctx.lineTo(0.06 * w, 0.45 * w);
        ctx.lineTo(0.06 * w, 0.38 * w);
        ctx.lineTo(0.15 * w, 0.38 * w);
        ctx.lineTo(0.15 * w, 0.34 * w);
        ctx.lineTo(0.06 * w, 0.34 * w);
        ctx.lineTo(0.06 * w, 0.3 * w);
        ctx.lineTo(0.18 * w, 0.3 * w);
        ctx.lineTo(0.18 * w, 0.24 * w);
        ctx.lineTo(0.06 * w, 0.24 * w);
        let grd = ctx.createRadialGradient(0, -0.35 * w, 0, 0, 0, 0.5 * w);
        grd.addColorStop(0, 'white');
        grd.addColorStop(0.3, (this.index >= 0) ? colorList[this.index] : 'black');
        grd.addColorStop(1, (this.index >= 0) ? colorList[this.index] : 'black');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects) {
        if (this.index === -1) {
            let usedIndex = [0, 0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].type === 'lockedWall') usedIndex[objects[i].index] = Math.max(1, usedIndex[objects[i].index]);
                if (objects[i].type === 'unlocker') usedIndex[objects[i].index] = 2;
            }
            for (let i = 0; i < usedIndex.length; i++) {
                if (usedIndex[i] === 1) {
                    this.index = i;
                    break;
                }
            }
            if (this.index === -1) {
                for (let i = 0; i < usedIndex.length; i++) {
                    if (usedIndex[i] === 0) {
                        this.index = i;
                        break;
                    }
                }
            }
        }
        if (this.index === -1) return false;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        return true;
    }
    remove(map, objects) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
    }
}

/* 方塊 */
export class block {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'block';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '方塊',
        };

        this.loadable = false;

        this.perspective = false;

        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new block();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;

        this.perspective = true;
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(w, w) }, target)) return 'block';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.4 : 1;

        ctx.beginPath();
        ctx.moveTo(-0.5 * w, -0.5 * w);
        ctx.lineTo(0.5 * w, -0.5 * w);
        ctx.lineTo(0.5 * w, 0.5 * w);
        ctx.lineTo(-0.5 * w, 0.5 * w);
        ctx.lineTo(-0.5 * w, -0.5 * w);
        ctx.fillStyle = '#7B7B7B';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(-0.5 * w, -0.5 * w, w, w);
        ctx.fillStyle = '#9D9D9D';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    place(map, objects = null) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}

/* 移動平台-斜向 */
export class movingPlatform_oblique {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'movingPlatform_oblique';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '移動平台(斜向)',
            direction: 'right-up',
            distance: 1,
            speed: 'normal',
        };

        this.loadable = true;
        this.loadObject = null;

        this.lastRecord = Date.now();
        this.active = false;
        this.perspective = false;

        this.layer = new Layer(0, 1);
    }
    clone() {
        const cloneObject = new movingPlatform_oblique();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            distance: { type: 'int', min: 1, max: 15 },
            direction: { type: 'select', options: ['right-up', 'right-down', 'left-up', 'left-down'] },
            speed: { type: 'select', options: ['super slow', 'slow', 'normal', 'fast', 'super fast'] }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            distance: this.detail.distance,
            speed: this.detail.speed,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;
        this.detail.distance = objectSetting.distance;
        this.detail.speed = objectSetting.speed;

        this.perspective = true;
    }
    update(objects, map) {
        const parameters = {
            'super slow': 5600, 'slow': 2800, 'normal': 1400, 'fast': 700, 'super fast': 280,
        };
        const dirVec = Vec2.direction(this.detail.direction).mul(this.detail.distance * w * Math.sqrt(2));
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        if (~~((Date.now() - this.lastRecord) / parameters[this.detail.speed] / this.detail.distance) % 2 === 0) {
            this.pos = originPos.add(dirVec.mul(((Date.now() - this.lastRecord) / parameters[this.detail.speed] / this.detail.distance) % 1));
        } else {
            this.pos = originPos.add(dirVec.mul(1 - ((Date.now() - this.lastRecord) / parameters[this.detail.speed] / this.detail.distance) % 1));
        }
        if (this.loadObject) this.loadObject.object.pos = this.pos;
        return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.9 * w, 0.9 * w) }, target)) return 'movingPlatform';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        if (this.active) ctx.translate(originPos.x, originPos.y);
        else ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        if (layer === -1 || layer === 0) {
            ctx.save();
            const dirVec = Vec2.direction(this.detail.direction).mul(this.detail.distance * w * Math.sqrt(2));

            ctx.beginPath();
            ctx.rect(-0.1 * w, -0.1 * w, 0.2 * w, 0.2 * w);
            ctx.fillStyle = '#4F4F4F';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(dirVec.x, dirVec.y);
            ctx.strokeStyle = '#4F4F4F';
            ctx.stroke();
            ctx.closePath();

            ctx.save();
            ctx.translate(dirVec.x, dirVec.y);
            ctx.beginPath();
            ctx.rect(-0.1 * w, -0.1 * w, 0.2 * w, 0.2 * w);
            ctx.fillStyle = '#4F4F4F';
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            ctx.restore();
        }

        if (layer === -1 || layer === 1) {
            if (this.active) {
                const relativePos = this.pos.sub(originPos);
                ctx.translate(relativePos.x, relativePos.y);
            }

            ctx.beginPath();
            ctx.moveTo(0, (-0.45) * w);
            ctx.arcTo(0.45 * w, (-0.45) * w, 0.45 * w, 0.45 * w, 0.1 * w);
            ctx.arcTo(0.45 * w, 0.45 * w, (-0.45) * w, 0.45 * w, 0.1 * w);
            ctx.arcTo((-0.45) * w, 0.45 * w, (-0.45) * w, (-0.45) * w, 0.1 * w);
            ctx.arcTo((-0.45) * w, (-0.45) * w, 0.45 * w, (-0.45) * w, 0.1 * w);
            ctx.lineTo(0, (-0.45) * w);
            ctx.fillStyle = '#ead48b';
            ctx.fill();
            ctx.strokeStyle = '#cb934d';
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0, (-0.35) * w);
            ctx.arcTo(0.35 * w, (-0.35) * w, 0.35 * w, 0.35 * w, 0.1 * w);
            ctx.arcTo(0.35 * w, 0.35 * w, (-0.35) * w, 0.35 * w, 0.1 * w);
            ctx.arcTo((-0.35) * w, 0.35 * w, (-0.35) * w, (-0.35) * w, 0.1 * w);
            ctx.arcTo((-0.35) * w, (-0.35) * w, 0.35 * w, (-0.35) * w, 0.1 * w);
            ctx.lineTo(0, (-0.35) * w);
            ctx.strokeStyle = '#f4f788';
            ctx.stroke();
            ctx.closePath();
        }

        ctx.restore();
    }
    place(map, objects) {
        this.active = true;
        this.lastRecord = Date.now();
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    this.loadObject = {
                        id: objects[i].id,
                        object: objects[i],
                    };
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        this.active = false;
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
    }
}

/* 移動平台-矩形 */
export class movingPlatform_rect {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'movingPlatform_rect';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '移動平台(矩形)',
            clock: 'clockwise',
            width: 1,
            height: 1,
            speed: 'normal',
        };

        this.loadable = true;
        this.loadObject = null;

        this.lastRecord = Date.now();
        this.active = false;
        this.perspective = false;

        this.layer = new Layer(0, 1);
    }
    clone() {
        const cloneObject = new movingPlatform_rect();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            clock: { type: 'select', options: ['clockwise', 'counterclockwise'] },
            width: { type: 'int', min: 1, max: 15 },
            height: { type: 'int', min: 1, max: 15 },
            speed: { type: 'select', options: ['super slow', 'slow', 'normal', 'fast', 'super fast'] }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            clock: this.detail.clock,
            width: this.detail.width,
            height: this.detail.height,
            speed: this.detail.speed,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.start = objectSetting.start;
        this.detail.width = objectSetting.width;
        this.detail.height = objectSetting.height;
        this.detail.speed = objectSetting.speed;

        this.perspective = true;
    }
    update(objects, map) {
        const parameters = {
            'super slow': 4000, 'slow': 2000, 'normal': 1000, 'fast': 500, 'super fast': 200,
        };
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        let totalDist = this.detail.width * 2 + this.detail.height * 2;
        let cycleList = (this.detail.clockwise === 'clockwise') ?
            [0, this.detail.height / totalDist, (this.detail.height + this.detail.width) / totalDist, (2 * this.detail.height + this.detail.width) / totalDist] :
            [0, this.detail.width / totalDist, (this.detail.height + this.detail.width) / totalDist, (this.detail.height + 2 * this.detail.width) / totalDist];
        let pointList = (this.detail.clockwise === 'clockwise') ?
            [originPos, originPos.add(new Vec2(0, - this.detail.height * w)), originPos.add(new Vec2(this.detail.width * w, - this.detail.height * w)), originPos.add(new Vec2(this.detail.width * w, 0))] :
            [originPos, originPos.add(new Vec2(this.detail.width * w, 0)), originPos.add(new Vec2(this.detail.width * w, - this.detail.height * w)), originPos.add(new Vec2(0, - this.detail.height * w))]  ;
        let moveCycle = ((Date.now() - this.lastRecord) / parameters[this.detail.speed] / totalDist) % 1;
        if (moveCycle >= cycleList[0] && moveCycle < cycleList[1]) {
            this.pos = pointList[0].add(pointList[1].sub(pointList[0]).mul((moveCycle - cycleList[0]) / (cycleList[1] - cycleList[0])));
        } else if (moveCycle >= cycleList[1] && moveCycle < cycleList[2]) {
            this.pos = pointList[1].add(pointList[2].sub(pointList[1]).mul((moveCycle - cycleList[1]) / (cycleList[2] - cycleList[1])));
        } else if (moveCycle >= cycleList[2] && moveCycle < cycleList[3]) {
            this.pos = pointList[2].add(pointList[3].sub(pointList[2]).mul((moveCycle - cycleList[2]) / (cycleList[3] - cycleList[2])));
        } else {
            this.pos = pointList[3].add(pointList[0].sub(pointList[3]).mul((moveCycle - cycleList[3]) / (1 - cycleList[3])));
        }
        if (this.loadObject) this.loadObject.object.pos = this.pos;
        return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.9 * w, 0.9 * w) }, target)) return 'movingPlatform';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        if (this.active) ctx.translate(originPos.x, originPos.y);
        else ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        if (layer === -1 || layer === 0) {
            ctx.save();

            ctx.beginPath();
            ctx.rect(0, - this.detail.height * w, this.detail.width * w, this.detail.height * w);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#4F4F4F';
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(-0.1 * w, -0.1 * w, 0.2 * w, 0.2 * w);
            ctx.fillStyle = '#4F4F4F';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(-0.1 * w, -0.1 * w - this.detail.height * w, 0.2 * w, 0.2 * w);
            ctx.fillStyle = '#4F4F4F';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(-0.1 * w + this.detail.width * w, -0.1 * w - this.detail.height * w, 0.2 * w, 0.2 * w);
            ctx.fillStyle = '#4F4F4F';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(-0.1 * w + this.detail.width * w, -0.1 * w, 0.2 * w, 0.2 * w);
            ctx.fillStyle = '#4F4F4F';
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        }

        if (layer === -1 || layer === 1) {
            if (this.active) {
                const relativePos = this.pos.sub(originPos);
                ctx.translate(relativePos.x, relativePos.y);
            }

            ctx.beginPath();
            ctx.moveTo(0, (-0.45) * w);
            ctx.arcTo(0.45 * w, (-0.45) * w, 0.45 * w, 0.45 * w, 0.1 * w);
            ctx.arcTo(0.45 * w, 0.45 * w, (-0.45) * w, 0.45 * w, 0.1 * w);
            ctx.arcTo((-0.45) * w, 0.45 * w, (-0.45) * w, (-0.45) * w, 0.1 * w);
            ctx.arcTo((-0.45) * w, (-0.45) * w, 0.45 * w, (-0.45) * w, 0.1 * w);
            ctx.lineTo(0, (-0.45) * w);
            ctx.fillStyle = '#ead48b';
            ctx.fill();
            ctx.strokeStyle = '#cb934d';
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0, (-0.35) * w);
            ctx.arcTo(0.35 * w, (-0.35) * w, 0.35 * w, 0.35 * w, 0.1 * w);
            ctx.arcTo(0.35 * w, 0.35 * w, (-0.35) * w, 0.35 * w, 0.1 * w);
            ctx.arcTo((-0.35) * w, 0.35 * w, (-0.35) * w, (-0.35) * w, 0.1 * w);
            ctx.arcTo((-0.35) * w, (-0.35) * w, 0.35 * w, (-0.35) * w, 0.1 * w);
            ctx.lineTo(0, (-0.35) * w);
            ctx.strokeStyle = '#f4f788';
            ctx.stroke();
            ctx.closePath();
        }

        ctx.restore();
    }
    place(map, objects) {
        this.active = true;
        this.lastRecord = Date.now();
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    this.loadObject = {
                        id: objects[i].id,
                        object: objects[i],
                    };
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        this.active = false;
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
    }
}

/* 木箱 */
export class woodenBox {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'woodenBox';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '木箱',
        };

        this.loadable = false;

        this.perspective = false;

        this.moveTo = 'none';
        this.moveTime = 500;
        this.moveCycle = 0;
        this.lastRecord = 0;

        this.layer = new Layer(3);
    }
    clone() {
        const cloneObject = new woodenBox();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;

        this.perspective = true;
    }
    update(objects, map) {
        if (this.moveTo !== 'none') {
            let moveRate = (Date.now() - this.lastRecord) / this.moveTime;
            this.moveCycle += moveRate;
            this.lastRecord = Date.now();
            this.pos = this.pos.add(Vec2.direction(this.moveTo).mul(w * moveRate));
            if (this.moveCycle >= 1) {
                this.moveTo = 'none';
                this.pos = this.pos.sub(constant.mapStart).toGrid(w).mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
            }
        } else {
            let gridPos = this.pos.sub(constant.mapStart).toGrid(w);
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].type !== 'brokenPlatform' && objects[i].type !== 'magnet' && objects[i].type !== 'conveyor' && objects[i].type !== 'mucus') continue;
                if (objects[i].id !== this.id && objects[i].collision) {
                    let result = objects[i].collision({ type: 'sphere', pos: this.pos, r: 0.1 });
                    if (result === 'brokenPlatform') objects[i].break();
                    if (result === 'conveyor') {
                        this.pos = objects[i].pos.clone();
                        this.push(objects, map, this.pos.sub(Vec2.direction(objects[i].detail.direction)));
                        break;
                    } else if (result === 'magneticField') {
                        this.push(objects, map, this.pos.sub(objects[i].getDisplacement()));
                        break;
                    } else if (result === 'mucus' && !objects[i].loadObject) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                        map[this.gridPos.y][this.gridPos.x].layer.status[3] = false;
                    }
                    
                }
            }
        }
        return { type: 'none' };
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(w, w) }, target)) return 'woodenBox';
        return 'none';
    }
    push(objects, map, targetPos) {
        if (this.moveTo !== 'none') return;
        let gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let radian = targetPos.sub(this.pos).radian();
        if (radian >= 0.25 * Math.PI && radian < 0.75 * Math.PI) { // 上
            if (gridPos.y === 0 || map[gridPos.y - 1][gridPos.x].type === 'block') return;
            for (let i = 0; i < objects.length; i++) {
                let searchGridPos = objects[i].pos.sub(constant.mapStart).toGrid(w);
                if (searchGridPos.equal(new Vec2(gridPos.x, gridPos.y - 1)) && objects[i].layer.status[3]) return;
            }
            this.moveTo = 'up';
        } else if (radian >= 1.75 * Math.PI || radian < 0.25 * Math.PI) { // 左
            if (gridPos.x === 0 || map[gridPos.y][gridPos.x - 1].type === 'block') return;
            for (let i = 0; i < objects.length; i++) {
                let searchGridPos = objects[i].pos.sub(constant.mapStart).toGrid(w);
                if (searchGridPos.equal(new Vec2(gridPos.x - 1, gridPos.y)) && objects[i].layer.status[3]) return;
            }
            this.moveTo = 'left';
        } else if (radian >= 1.25 * Math.PI && radian < 1.75 * Math.PI) { // 下
            if (gridPos.y === constant.mapSize.y - 1 || map[gridPos.y + 1][gridPos.x].type === 'block') return;
            for (let i = 0; i < objects.length; i++) {
                let searchGridPos = objects[i].pos.sub(constant.mapStart).toGrid(w);
                if (searchGridPos.equal(new Vec2(gridPos.x, gridPos.y + 1)) && objects[i].layer.status[3]) return;
            }
            this.moveTo = 'down';
        } else { // 右
            if (gridPos.x === constant.mapSize.x - 1 || map[gridPos.y][gridPos.x + 1].type === 'block') return;
            for (let i = 0; i < objects.length; i++) {
                let searchGridPos = objects[i].pos.sub(constant.mapStart).toGrid(w);
                if (searchGridPos.equal(new Vec2(gridPos.x + 1, gridPos.y)) && objects[i].layer.status[3]) return;
            }
            this.moveTo = 'right';
        }
        map[this.gridPos.y][this.gridPos.x].layer.status[3] = false;
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].type === 'mucus') {
                if (objects[i].loadObject && objects[i].loadObject.id === this.id) {
                    objects[i].loadObject = null;
                    this.pos = this.pos.sub(constant.mapStart).toGrid(w).mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
                }
            }
        }
        this.moveCycle = 0;
        this.lastRecord = Date.now();
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.7 : 1;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.rect(-0.45 * w, -0.4 * w, 0.9 * w, 0.8 * w);
        ctx.fillStyle = '#e4b95e';
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(-0.5 * w, -0.5 * w, w, 0.1 * w);
        ctx.fillStyle = '#dab25d';
        ctx.fill();
        ctx.strokeStyle = '#806938';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(-0.5 * w, 0.4 * w, w, 0.1 * w);
        ctx.fillStyle = '#dab25d';
        ctx.fill();
        ctx.strokeStyle = '#806938';
        ctx.stroke();
        ctx.closePath();

        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.moveTo((-0.45 + i * 0.15) * w, -0.4 * w);
            ctx.lineTo((-0.45 + i * 0.15) * w, 0.4 * w);
            ctx.strokeStyle = '#806938';
            ctx.stroke();
            ctx.closePath();
        }

        ctx.restore();
    }
    place(map, objects = null) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 2) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects = null) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].layer.top() === 2) {
                if (objects[i].loadObject && objects[i].loadObject.id === this.id) {
                    objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}

/* 磁鐵 */
export class magnet {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'magnet';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '磁鐵',
            direction: 'up',
            magneticField: 'attraction',
            distance: 3,
        };

        this.loadable = false;

        this.active = false;
        this.perspective = false;

        this.lastRecord = 0;
        this.moveCycle = -1;

        this.layer = new Layer(4);
    }
    clone() {
        const cloneObject = new magnet();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' },
            direction: { type: 'select', options: ['up', 'down', 'left', 'right'] },
            magneticField: { type: 'select', options: ['attraction', 'repulsion'] },
            distance: { type: 'int', min: 1, max: 15 },
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            magneticField: this.detail.magneticField,
            distance: this.detail.distance,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;
        this.detail.magneticField = objectSetting.magneticField;
        this.detail.distance = objectSetting.distance;

        this.perspective = true;
    }
    update(objects, map) {
        if (Date.now() - this.lastRecord > 1000) this.lastRecord = Date.now();
        this.moveCycle = (Date.now() - this.lastRecord) / 1000;
        return { type: 'none' };
    }
    collision(target) {
        let dirVec = Vec2.direction(this.detail.direction).mul(w * this.detail.distance / 2);
        let size = (this.detail.direction === 'up' || this.detail.direction === 'down') ? new Vec2(w, this.detail.distance * w + 0.5 * w) : new Vec2(this.detail.distance * w + 0.5 * w, w) ;
        if (isCollision({ type: 'cube', pos: this.pos.add(dirVec), size: size }, target)) return 'magneticField';
        return 'none';
    }
    getDisplacement() {
        return Vec2.direction(this.detail.direction).mul((this.detail.magneticField === 'attraction')? -1: 1).mul(w * 0.01);
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;
        let dir = this.detail.direction;
        ctx.rotate((dir === 'up') ? 0 : (dir === 'down') ? Math.PI : (dir === 'left') ? 1.5 * Math.PI : 0.5 * Math.PI);

        ctx.beginPath();
        ctx.moveTo(0.4 * w, -0.4 * w);
        ctx.arc(0, 0, 0.4 * w, 0, Math.PI);
        ctx.lineTo(-0.4 * w, -0.4 * w);
        ctx.lineTo(-0.2 * w, -0.4 * w);
        ctx.lineTo(-0.2 * w, 0);
        ctx.arc(0, 0, 0.2 * w, Math.PI, 0, true);
        ctx.lineTo(0.2 * w, -0.4 * w);
        ctx.lineTo(0.4 * w, -0.4 * w);
        ctx.fillStyle = '#43315e';
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(-0.38 * w, -0.4 * w, 0.16 * w, 0.3 * w);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();

        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.font = "5px italic";
        ctx.fillStyle = 'white';
        ctx.fillText("N", -0.3 * w, -0.25 * w);

        ctx.beginPath();
        ctx.rect(0.22 * w, -0.4 * w, 0.16 * w, 0.3 * w);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();

        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.font = "6px italic";
        ctx.fillStyle = 'white';
        ctx.fillText("S", 0.3 * w, -0.25 * w);

        ctx.beginPath();
        ctx.moveTo(0.4 * w, -0.4 * w);
        ctx.arc(0, 0, 0.4 * w, 0, Math.PI);
        ctx.lineTo(-0.4 * w, -0.4 * w);
        ctx.lineTo(-0.2 * w, -0.4 * w);
        ctx.lineTo(-0.2 * w, 0);
        ctx.arc(0, 0, 0.2 * w, Math.PI, 0, true);
        ctx.lineTo(0.2 * w, -0.4 * w);
        ctx.lineTo(0.4 * w, -0.4 * w);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();

        if (this.active && this.moveCycle >= 0) {
            ctx.beginPath();
            ctx.rect(-0.5 * w, -0.5 * w - w * this.detail.distance, w, w * this.detail.distance);
            ctx.clip();
            ctx.closePath();

            ctx.globalAlpha = 0.3;
            ctx.translate(0, w * this.moveCycle * ((this.detail.magneticField == 'repulsion') ? -1 : 1));

            ctx.beginPath();
            ctx.moveTo(-0.3 * w, 0.5 * w);
            ctx.lineTo(-0.3 * w, 0.5 * w - w * this.detail.distance - 2 * w);
            ctx.setLineDash([0.5, 0, 5]);
            ctx.strokeStyle = 'gray';
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0, 0.5 * w);
            ctx.lineTo(0, 0.5 * w - w * this.detail.distance - 2 * w);
            ctx.setLineDash([0.5, 0, 5]);
            ctx.strokeStyle = 'gray';
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0.3 * w, 0.5 * w);
            ctx.lineTo(0.3 * w, 0.5 * w - w * this.detail.distance - 2 * w);
            ctx.setLineDash([0.5, 0, 5]);
            ctx.strokeStyle = 'gray';
            ctx.stroke();
            ctx.closePath();
        }

        ctx.restore();
    }
    place(map, objects = null) {
        this.active = true;
        this.moveCycle = -1;
        this.lastRecord = Date.now();
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        this.lastRecord = Date.now();
        return true;
    }
    remove(map, objects = null) {
        this.active = false;
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
    }
}

/* 破碎平台 */
export class brokenPlatform {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'brokenPlatform';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '破碎平台'
        };

        this.loadable = false;

        this.perspective = false;

        this.lastRecord = 0;
        this.stage = 0;
        this.count = 0;
        this.stageCount = 64;

        this.layer = new Layer(1, 2);
    }
    clone() {
        const cloneObject = new brokenPlatform();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;

        this.perspective = true;
    }
    update(objects, map) {
        if (this.count >= this.stageCount && this.stage < 4) {
            this.count = 0;
            this.stage += 1;
        }
        return { type: 'none' };
    }
    collision(target) {
        if (this.stage < 4 && isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.99 * w, 0.99 * w) }, target)) return 'brokenPlatform';
        return 'none';
    }
    break() {
        this.count += 1;
    }
    draw(ctx, layer = -1) {
        if (this.stage === 4) return;

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        ctx.beginPath();
        ctx.moveTo(0, (-0.45) * w);
        ctx.arcTo(0.45 * w, (-0.45) * w, 0.45 * w, 0.45 * w, 0.1 * w);
        ctx.arcTo(0.45 * w, 0.45 * w, (-0.45) * w, 0.45 * w, 0.1 * w);
        ctx.arcTo((-0.45) * w, 0.45 * w, (-0.45) * w, (-0.45) * w, 0.1 * w);
        ctx.arcTo((-0.45) * w, (-0.45) * w, 0.45 * w, (-0.45) * w, 0.1 * w);
        ctx.lineTo(0, (-0.45) * w);
        ctx.fillStyle = '#D0D0D0';
        ctx.fill();
        ctx.strokeStyle = '#ADADAD';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, (-0.35) * w);
        ctx.arcTo(0.35 * w, (-0.35) * w, 0.35 * w, 0.35 * w, 0.1 * w);
        ctx.arcTo(0.35 * w, 0.35 * w, (-0.35) * w, 0.35 * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, 0.35 * w, (-0.35) * w, (-0.35) * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, (-0.35) * w, 0.35 * w, (-0.35) * w, 0.1 * w);
        ctx.lineTo(0, (-0.35) * w);
        ctx.strokeStyle = '#F0F0F0';
        ctx.stroke();
        ctx.closePath();

        if (this.stage >= 0) {
            ctx.save();
            ctx.strokeStyle = '#ADADAD';
            ctx.globalAlpha *= (this.stage > 0) ? 1: (this.count) / this.stageCount;

            ctx.beginPath();
            ctx.moveTo(0.1 * w, -0.45 * w);
            ctx.lineTo(0.05 * w, -0.35 * w);
            ctx.lineTo(0.15 * w, -0.25 * w);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(-0.45 * w, 0.15 * w);
            ctx.lineTo(-0.35 * w, -0.05 * w);
            ctx.lineTo(-0.25 * w, 0.05 * w);
            ctx.lineTo(-0.15 * w, -0.15 * w);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0.15 * w, 0.45 * w);
            ctx.lineTo(0.25 * w, 0.4 * w);
            ctx.lineTo(0.2 * w, 0.3 * w);
            ctx.lineTo(0.35 * w, 0.1 * w);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }

        if (this.stage >= 1) {
            ctx.save();
            ctx.strokeStyle = '#ADADAD';
            ctx.globalAlpha *= (this.stage > 1) ? 1 : (this.count) / this.stageCount;

            ctx.beginPath();
            ctx.moveTo(-0.15 * w, 0.45 * w);
            ctx.lineTo(0 * w, 0.35 * w);
            ctx.lineTo(-0.1 * w, 0.25 * w);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0.45 * w, -0.3 * w);
            ctx.lineTo(0.35 * w, -0.2 * w);
            ctx.lineTo(0.3 * w, -0.05 * w);
            ctx.lineTo(0.1 * w, -0.15 * w);
            ctx.lineTo(-0.1 * w, 0.05 * w);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(-0.35 * w, -0.45 * w);
            ctx.lineTo(-0.2 * w, -0.3 * w);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }

        if (this.stage >= 2) {
            ctx.save();
            ctx.strokeStyle = '#ADADAD';
            ctx.globalAlpha *= (this.stage > 2) ? 1 : (this.count) / this.stageCount;

            ctx.beginPath();
            ctx.moveTo(-0.45 * w, 0.37 * w);
            ctx.lineTo(-0.36 * w, 0.3 * w);
            ctx.lineTo(-0.23 * w, 0.35 * w);
            ctx.lineTo(-0.01 * w, 0.09 * w);
            ctx.lineTo(0.23 * w, 0.21 * w);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(-0.45 * w, 0.21 * w);
            ctx.lineTo(-0.2 * w, 0.16 * w);
            ctx.lineTo(-0.02 * w, -0.02 * w);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(-0.05 * w, -0.45 * w);
            ctx.lineTo(-0.18 * w, -0.36 * w);
            ctx.lineTo(0.03 * w, -0.28 * w);
            ctx.lineTo(-0.28 * w, -0.16 * w);
            ctx.lineTo(-0.38 * w, -0.25 * w);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0.34 * w, -0.45 * w);
            ctx.lineTo(0.27 * w, -0.32 * w);
            ctx.lineTo(0.3 * w, -0.09 * w);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0.45 * w, 0.31 * w);
            ctx.lineTo(0.4 * w, 0.14 * w);
            ctx.lineTo(0.3 * w, 0.22 * w);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0.45 * w, 0.01 * w);
            ctx.lineTo(0.2 * w, 0.03 * w);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }

        ctx.restore();
    }
    place(map, objects = null) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        return true;
    }
    remove(map, objects = null) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
    }
}

/* 死亡圖騰 */
export class deathTotem {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'deathTotem';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: '死亡圖騰'
        };

        this.loadable = false;

        this.perspective = false;

        this.layer = new Layer(2);
    }
    clone() {
        const cloneObject = new deathTotem();
        cloneObject.unpackage(this.enpackage());
        return cloneObject;
    }
    setPerspective(perspective) {
        this.perspective = perspective;
    }
    detailFunction() {
        return {
            name: { type: 'text' }
        };
    }
    enpackage() {
        return {
            type: this.type,
            id: this.id,
            gridPos: { x: this.gridPos.x, y: this.gridPos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.gridPos = new Vec2(objectSetting.gridPos.x, objectSetting.gridPos.y);
        this.pos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));

        this.detail.name = objectSetting.name;

        this.perspective = true;
    }
    collision(target) {
        if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.7 * w, 0.7 * w) }, target)) return 'deathTotem';
        return 'none';
    }
    draw(ctx, layer = -1) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        ctx.beginPath();
        ctx.moveTo(0, (-0.35) * w);
        ctx.arcTo(0.35 * w, (-0.35) * w, 0.35 * w, 0.35 * w, 0.1 * w);
        ctx.arcTo(0.35 * w, 0.35 * w, (-0.35) * w, 0.35 * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, 0.35 * w, (-0.35) * w, (-0.35) * w, 0.1 * w);
        ctx.arcTo((-0.35) * w, (-0.35) * w, 0.35 * w, (-0.35) * w, 0.1 * w);
        ctx.lineTo(0, (-0.35) * w);
        let grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 0.45 * w);
        grd.addColorStop(0, '#E800E8');
        grd.addColorStop(1, '#5E005E');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.strokeStyle = '#460046';
        ctx.stroke();
        ctx.closePath();

        ctx.globalAlpha = 1;
        ctx.scale(0.8, 0.8);
        
        ctx.beginPath();
        ctx.arc(0, 0, 0.25 * w, 0.25 * Math.PI, 0.75 * Math.PI, true);
        ctx.lineTo(-0.1 * w, 0.3 * w);
        ctx.lineTo(0.1 * w, 0.3 * w);
        let grd2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 0.2 * w);
        grd2.addColorStop(0, 'white');
        grd2.addColorStop(1, '#E0E0E0');
        ctx.fillStyle = grd2;
        ctx.fill();
        ctx.closePath();

        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-0.08 * w + 0.08 * i * w, 0.31 * w);
            ctx.lineTo(-0.08 * w + 0.08 * i * w, 0.24 * w);
            ctx.strokeStyle = grd;
            ctx.stroke();
            ctx.closePath();
        }

        for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            ctx.arc(-0.1 * w, -0.01 * w, 0.08 * w, 0.16 * Math.PI, 1.16 * Math.PI);
            ctx.fillStyle = grd;
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(-0.02 * w, 0.1 * w);
            ctx.lineTo(-0.045 * w, 0.16 * w);
            ctx.strokeStyle = grd;
            ctx.stroke();
            ctx.closePath();

            ctx.scale(-1, 1);
        }

        ctx.restore();
    }
    place(map, objects) {
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        let gridPos = this.gridPos;
        if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
        if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[1]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 1) {
                    if (objects[i].loadable) {
                        objects[i].loadObject = {
                            id: this.id,
                            object: this,
                        };
                    }
                    break;
                }
            }
        }
        return true;
    }
    remove(map, objects) {
        let gridPos = this.gridPos;
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[1]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.equal(gridPos) && objects[i].layer.top() === 1) {
                    if (objects[i].loadable) objects[i].loadObject = null;
                    break;
                }
            }
        }
    }
}