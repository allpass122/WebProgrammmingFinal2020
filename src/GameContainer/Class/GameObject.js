import Vec2 from './Vec2';
import constant from '../constant';
import Layer from './Layer';

const uuidv4 = require("uuid/v4");
const w = constant.gridWidth;

/* 尖刺方塊 */
export class spikedBlock {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'spikedBlock';
        this.id = uuidv4();
        this.pos = pos;
        this.gridPos = this.pos.sub(constant.mapStart).toGrid(w);

        this.detail = {
            name: 'spikedBlock'
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
    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.4 : 1;

        ctx.beginPath();
        ctx.moveTo((-0.5) * w, (-0.5) * w);
        for (let i = 1; i <= 8; i++) ctx.lineTo((-0.5 + 0.125 * i) * w, (-0.5 - 0.25 * (i % 2)) * w);
        for (let i = 1; i <= 8; i++) ctx.lineTo((0.5 + 0.25 * (i % 2)) * w, (-0.5 + 0.125 * i) * w);
        for (let i = 1; i <= 8; i++) ctx.lineTo((0.5 - 0.125 * i) * w, (0.5 + 0.25 * (i % 2)) * w);
        for (let i = 1; i <= 8; i++) ctx.lineTo((-0.5 - 0.25 * (i % 2)) * w, (0.5 - 0.125 * i) * w);
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
            (gridPos.x - 1 >= 0 && constant.typeLayerPairs[map[gridPos.y][gridPos.x - 1].type].isOverlap(this.layer)) ||
            (gridPos.y - 1 >= 0 && constant.typeLayerPairs[map[gridPos.y - 1][gridPos.x].type].isOverlap(this.layer)) ||
            (gridPos.x + 1 < constant.mapSize.x && constant.typeLayerPairs[map[gridPos.y][gridPos.x + 1].type].isOverlap(this.layer)) ||
            (gridPos.y + 1 < constant.mapSize.y && constant.typeLayerPairs[map[gridPos.y + 1][gridPos.x].type].isOverlap(this.layer))) {
            return false;
        }
        if ((map[gridPos.y][gridPos.x].layer.isOverlap(this.layer)) ||
            (gridPos.x - 1 >= 0 && map[gridPos.y][gridPos.x - 1].layer.isOverlap(this.layer)) ||
            (gridPos.y - 1 >= 0 && map[gridPos.y - 1][gridPos.x].layer.isOverlap(this.layer)) ||
            (gridPos.x + 1 < constant.mapSize.x && map[gridPos.y][gridPos.x + 1].layer.isOverlap(this.layer)) ||
            (gridPos.y + 1 < constant.mapSize.y && map[gridPos.y + 1][gridPos.x].layer.isOverlap(this.layer))) {
            return false;
        }
        map[gridPos.y][gridPos.x].layer.add(this.layer);
        if (gridPos.x - 1 >= 0) map[gridPos.y][gridPos.x - 1].layer.add(this.layer);
        if (gridPos.y - 1 >= 0) map[gridPos.y - 1][gridPos.x].layer.add(this.layer);
        if (gridPos.x + 1 < constant.mapSize.x) map[gridPos.y][gridPos.x + 1].layer.add(this.layer);
        if (gridPos.y + 1 < constant.mapSize.y) map[gridPos.y + 1][gridPos.x].layer.add(this.layer);
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
        if (gridPos.x - 1 >= 0) map[gridPos.y][gridPos.x - 1].layer.sub(this.layer);
        if (gridPos.y - 1 >= 0) map[gridPos.y - 1][gridPos.x].layer.sub(this.layer);
        if (gridPos.x + 1 < constant.mapSize.x) map[gridPos.y][gridPos.x + 1].layer.sub(this.layer);
        if (gridPos.y + 1 < constant.mapSize.y) map[gridPos.y + 1][gridPos.x].layer.sub(this.layer);
        if (map[gridPos.y][gridPos.x].layer.status[2]) {
            for (let i = 0; i < objects.length; i++) {
                if (objects[i].gridPos.toGrid(w).equal(gridPos) && objects[i].layer.top() === 2) {
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
        this.loadObject =  null;

        this.life = 0;
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
            speed: { type: 'select', options: ['super slow', 'slow', 'normal', 'fast', 'super fast']}
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
    update(frames = 1) {
        this.life += frames;
        const parameters = {
            'super slow': 240, 'slow': 120, 'normal': 60, 'fast': 30, 'super fast': 15,
        };
        const dir = this.detail.direction;
        const dirVec = (dir === 'up') ? new Vec2(0, -1) : (dir === 'down') ? new Vec2(0, 1) : (dir === 'left') ? new Vec2(-1, 0) : new Vec2(1, 0);
        if (this.loadObject) {
            if (~~(this.life / parameters[this.detail.speed] / this.detail.distance) % 2 === 0) {
                this.loadObject.object.pos = this.pos.add(dirVec.mul(this.detail.distance * w * ((this.life / parameters[this.detail.speed] / this.detail.distance) % 1)));
            } else {
                this.loadObject.object.pos = this.pos.add(dirVec.mul(this.detail.distance * w * (1 - (this.life / parameters[this.detail.speed] / this.detail.distance) % 1)));
            }
        }
        return { type: 'none' };
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.globalAlpha = (this.perspective) ? 0.8 : 1;
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

        const parameters = {
            'super slow': 240, 'slow': 120, 'normal': 60, 'fast': 30, 'super fast': 15,
        };
        if (~~(this.life / parameters[this.detail.speed] / this.detail.distance) % 2 === 0) {
            ctx.translate(0, - this.detail.distance * w * ((this.life / parameters[this.detail.speed] / this.detail.distance) % 1));
        } else {
            ctx.translate(0, - this.detail.distance * w * (1 - (this.life / parameters[this.detail.speed] / this.detail.distance) % 1));
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

        this.life = 0;
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
    update(frames = 1) {
        const parameters = {
            slow: 300, normal: 180, fast: 60
        }
        this.life += frames;
        if (this.life !== 0 && this.life % parameters[this.detail.RoF] === 0) {
            let dir = this.detail.direction;
            let dirVec = (dir === 'up') ? new Vec2(0, -0.5 * w) : (dir === 'down') ? new Vec2(0, 0.5 * w) : (dir === 'left') ? new Vec2(-0.5 * w, 0) : new Vec2(0.5 * w, 0);
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
            slow: 300, normal: 180, fast: 60
        }
        let lifeCycle = (this.life / parameters[this.detail.RoF]) % 1;
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
        this.life = 0;
        this.maxlife = 600;
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
    update(frames = 1) {
        this.life += frames;
        if (this.life >= this.maxlife || !this.pos.between(constant.mapStart, constant.mapStart.add(constant.mapSize.mul(w)))) return { type: 'destory' };
        let dir = this.detail.direction;
        let speedWidth = this.speed * w;
        let dirVec = (dir === 'up') ? new Vec2(0, -speedWidth) : (dir === 'down') ? new Vec2(0, speedWidth) : (dir === 'left') ? new Vec2(-speedWidth, 0) : new Vec2(speedWidth, 0);
        this.pos = this.pos.add(dirVec.mul(frames / 60));
        return { type: 'none' };
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
    update(frames = 1) {
        if (this.loadObject) this.loadObject.object.pos = this.pos.clone();
        return { type: 'none' };
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

/*
export class ObjectName {
	constructor(pos = new Vec2(0, 0)) {
		this.type = 'ObjectName';
        this.id = uuidv4();
		this.pos = pos;

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