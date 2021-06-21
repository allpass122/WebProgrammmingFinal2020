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


/* 尖刺方塊 */
export class spikedBlock {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'spikedBlock';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: 'spikedBlock',
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
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        return {
            type: this.type,
            id: this.id,
            pos: { x: originPos.x, y: originPos.y },

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
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail.name = objectSetting.name;
        this.detail.upSpike = objectSetting.upSpike;
        this.detail.downSpike = objectSetting.downSpike;
        this.detail.leftSpike = objectSetting.leftSpike;
        this.detail.rightSpike = objectSetting.rightSpike;

        this.perspective = true;
    }
    collision(target) {
        switch (target.type) {
            case 'sphere':
                if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(w, w) }, target)) return 'block';
                if ((this.detail.leftSpike && isCollision({ type: 'cube', pos: this.pos.add(new Vec2(-0.625 * w, 0)), size: new Vec2(0.25 * w, 0.75 * w) }, target)) ||
                    (this.detail.rightSpike && isCollision({ type: 'cube', pos: this.pos.add(new Vec2(0.625 * w, 0)), size: new Vec2(0.25 * w, 0.75 * w) }, target)) ||
                    (this.detail.upSpike && isCollision({ type: 'cube', pos: this.pos.add(new Vec2(0, -0.625 * w)), size: new Vec2(0.25 * w, 0.75 * w) }, target)) ||
                    (this.detail.downSpike && isCollision({ type: 'cube', pos: this.pos.add(new Vec2(0, 0.625 * w)), size: new Vec2(0.25 * w, 0.75 * w) }, target)))
                    return 'spike';
                return 'none';
            default:
                return 'none';
        }
    }
    draw(ctx) {
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
            name: 'platform'
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
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        return {
            type: this.type,
            id: this.id,
            pos: { x: originPos.x, y: originPos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail.name = objectSetting.name;

        this.perspective = true;
    }
    collision(target) {
        switch (target.type) {
            case 'sphere':
                if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.7 * w, 0.7 * w) }, target)) return 'platform';
                return 'none';
            default:
                return 'none';
        }
    }
    draw(ctx) {
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
            name: 'movingPlatform',
            direction: 'up',
            distance: 1,
            speed: 'normal',
        };

        this.loadable = true;
        this.loadObject = null;

        this.lastRecord = Date.now();
        this.active = false;
        this.perspective = false;

        this.layer = new Layer(1);
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
            direction: { type: 'select', options: ['up', 'down', 'left', 'right'] },
            distance: { type: 'int', min: 0, max: 31 },
            speed: { type: 'select', options: ['super slow', 'slow', 'normal', 'fast', 'super fast'] }
        };
    }
    enpackage() {
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        return {
            type: this.type,
            id: this.id,
            pos: { x: originPos.x, y: originPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            distance: this.detail.distance,
            speed: this.detail.speed,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;
        this.detail.distance = objectSetting.distance;
        this.detail.speed = objectSetting.speed;

        this.perspective = true;
    }
    update(objects = null) {
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
        switch (target.type) {
            case 'sphere':
                if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.7 * w, 0.7 * w) }, target)) return 'movingPlatform';
                return 'none';
            default:
                return 'none';
        }
    }
    draw(ctx) {
        ctx.save();
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        if (this.active) ctx.translate(originPos.x, originPos.y);
        else ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

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
            name: 'bow',
            direction: 'up',
            RoF: 'normal'
        };

        this.loadable = false;

        this.lastFire = Date.now();
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
            RoF: { type: 'select', options: ['slow', 'normal', 'fast'] }
        };
    }
    enpackage() {
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        return {
            type: this.type,
            id: this.id,
            pos: { x: originPos.x, y: originPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            RoF: this.detail.RoF,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;
        this.detail.RoF = objectSetting.RoF;

        this.perspective = true;
    }
    update(objects = null) {
        const parameters = {
            slow: 5000, normal: 3000, fast: 1000
        }
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
    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;
        let dir = this.detail.direction;
        ctx.rotate((dir === 'up') ? 0 : (dir === 'down') ? Math.PI : (dir === 'left') ? 1.5 * Math.PI : 0.5 * Math.PI);

        const parameters = {
            slow: 5000, normal: 3000, fast: 1000
        }
        let lifeCycle = (this.active) ? (Date.now() - this.lastFire) / parameters[this.detail.RoF] : 0;
        lifeCycle = (lifeCycle > 0.5) ? (lifeCycle - 0.5) / 0.5 : 0;
        const drawPoint = (new Vec2(0, 0.05)).add((new Vec2(0, 0.35)).mul(lifeCycle));

        if (lifeCycle > 0) {
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
            name: 'arrow',
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
    update(objects) {
        if (!this.pos.between(constant.mapStart, constant.mapStart.add(constant.mapSize.mul(w)))) return { type: 'destory' };
        for (let i = 0; i < objects.length; i++) {
            if (objects[i].id !== this.id && objects[i].collision) {
                let result = objects[i].collision({ type: 'sphere', pos: this.pos, r: 0.1 });
                console.log(result);
                if (result === 'block') return { type: 'destory' };
            }
        }
        let dirVec = Vec2.direction(this.detail.direction).mul(this.speed * w);
        this.pos = this.pos.add(dirVec.mul((Date.now() - this.lastRecord) / 1000));
        this.lastRecord = Date.now();
        return { type: 'none' };
    }
    collision(target) {
        switch (target.type) {
            case 'sphere':
                if (isCollision({ type: 'sphere', pos: this.pos, r: 0.1 }, target)) return 'arrow';
                return 'none';
            default:
                return 'none';
        }
    }
    draw(ctx) {
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
            name: 'mucus'
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
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        return {
            type: this.type,
            id: this.id,
            pos: { x: originPos.x, y: originPos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail.name = objectSetting.name;

        this.perspective = true;
    }
    update(objects = null) {
        if (this.loadObject) this.loadObject.object.pos = this.pos.clone();
        return { type: 'none' };
    }
    collision(target) {
        switch (target.type) {
            case 'sphere':
                if (isCollision({ type: 'cube', pos: this.pos, size: new Vec2(0.7 * w, 0.7 * w) }, target)) return 'mucus';
                return 'none';
            default:
                return 'none';
        }
    }
    draw(ctx) {
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
            name: 'cymbal',
            RoF: 'normal',
            range: 'normal',
        };

        this.loadable = false;

        this.lastFire = Date.now();
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
        const originPos = this.gridPos.mul(w).add(constant.mapStart).add(new Vec2(0.5 * w, 0.5 * w));
        return {
            type: this.type,
            id: this.id,
            pos: { x: originPos.x, y: originPos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            RoF: this.detail.RoF,
            range: this.detail.range,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.id = objectSetting.id;
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;
        this.detail.RoF = objectSetting.RoF;
        this.detail.range = objectSetting.range;

        this.perspective = true;
    }
    update(objects = null) {
        const parameters = {
            slow: 10000, normal: 6000, fast: 3000
        }
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
        switch (target.type) {
            case 'sphere':
                if (isCollision({ type: 'sphere', pos: this.pos, r: 0.48 * w }, target)) return 'cymbal';
                return 'none';
            default:
                return 'none';
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;

        const parameters = {
            slow: 12000, normal: 8000, fast: 4000
        }
        let lifeCycle = (this.active) ? (Date.now() - this.lastFire) / parameters[this.detail.RoF] : 0;
        let pivot = 0.96 + parameters[this.detail.RoF] * 0.0000025;
        let r = (lifeCycle < pivot) ? 0.05 + 0.4 * lifeCycle / pivot : 0.05 + 0.4 * (1 - lifeCycle) / (1 - pivot);

        ctx.beginPath();
        ctx.arc(0, 0, 0.48 * w, 0, 2 * Math.PI);
        var grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 0.48 * w);
        grd.addColorStop(0, 'white');
        grd.addColorStop(1, '#D6D6AD');
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.strokeStyle = '#E1E100';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(0, 0, r * w, 0, 2 * Math.PI);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(0, 0, 0.05 * w, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFAF60';
        ctx.fill();
        ctx.closePath();

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

/* 音波 */
export class cymbalWave {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'cymbalWave';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = new Vec2(-1, -1);

        this.detail = {
            name: 'cymbalWave',
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
    update(objects) {
        const parameters = {
            small: 2.5, normal: 3.5, large: 4.5
        }
        if (this.r > w * parameters[this.detail.range]) return { type: 'destory' };
        this.r = 0.4 * w + w * (Date.now() - this.lastRecord) / 1000; 
        return { type: 'none' };
    }
    collision(target) {
        switch (target.type) {
            case 'sphere':
                if (isCollision({ type: 'sphere', pos: this.pos, r: this.r }, target)) return 'cymbalWave';
                return 'none';
            default:
                return 'none';
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);

        const parameters = {
            small: 2.5, normal: 3.5, large: 4.5
        }
        ctx.globalAlpha = 0.25 * Math.max((1.1 - Math.pow(this.r / (w * parameters[this.detail.range]), 16)), 0);

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

/* 參考物件 */
/*
export class ObjectName {
	constructor(pos = new Vec2(0, 0)) {
		this.type = 'ObjectName';
        this.id = uuidv4();
		this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

		this.detail = {
			name: 'ObjectName'
		};

        this.loadable = false;

		this.perspective = false;

		this.layer = new Layer();
	}
	clone() {
		const cloneObject = new ObjectName();
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
			pos: { x: this.pos.x, y: this.pos.y },

			name: this.detail.name,
		};
	}
	unpackage(objectSetting) {
		this.type = objectSetting.type;
        this.id = objectSetting.id;
		this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);

		this.detail.name = objectSetting.name;

		this.perspective = true;
	}
	draw(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.globalAlpha = (this.perspective) ? 0.3 : 1;

		ctx.restore();
	}
	place(map) {
		let gridPos = this.pos.sub(constant.mapStart).toGrid(w);
		if (constant.typeLayerPairs[map[gridPos.y][gridPos.x].type].isOverlap(this.layer)) return false;
		if (map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) return false;
		map[gridPos.y][gridPos.x].layer.add(this.layer);
		return true;
	}
	remove(map) {
		let gridPos = this.pos.sub(constant.mapStart).toGrid(w);
		map[gridPos.y][gridPos.x].layer.sub(this.layer);
	}
}
*/