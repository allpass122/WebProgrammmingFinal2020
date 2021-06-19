import Vec2 from './Vec2';
import constant from '../constant';
import Layer from './Layer';
import { constants } from 'os';
import { release } from 'process';

const w = constant.gridWidth;

/* ¦y¨ë¤è¶ô */
export class spikedBlock {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'spikedBlock';
        this.pos = pos;

        this.detail = {
            name: 'spikedBlock'
        };

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
        return {
            type: this.type,
            pos: { x: this.pos.x, y: this.pos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);

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
    place(map) {
        let gridPos = this.pos.sub(constant.mapStart).toGrid(w);
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
        return true;
    }
    remove(map) {
        let gridPos = this.pos.sub(constant.mapStart).toGrid(w);
        map[gridPos.y][gridPos.x].layer.sub(this.layer);
        if (gridPos.x - 1 >= 0) map[gridPos.y][gridPos.x - 1].layer.sub(this.layer);
        if (gridPos.y - 1 >= 0) map[gridPos.y - 1][gridPos.x].layer.sub(this.layer);
        if (gridPos.x + 1 < constant.mapSize.x) map[gridPos.y][gridPos.x + 1].layer.sub(this.layer);
        if (gridPos.y + 1 < constant.mapSize.y) map[gridPos.y + 1][gridPos.x].layer.sub(this.layer);
    }
}

/* ¥­¥x */
export class platform {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'platform';
        this.pos = pos;

        this.detail = {
            name: 'platform'
        };

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
            pos: { x: this.pos.x, y: this.pos.y },

            name: this.detail.name,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);

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

/* ¤} */
export class bow {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'bow';
        this.pos = pos;

        this.detail = {
            name: 'bow',
            direction: 'up',
            RoF: 'normal'
        };

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
        return {
            type: this.type,
            pos: { x: this.pos.x, y: this.pos.y },

            name: this.detail.name,
            direction: this.detail.direction,
            RoF: this.detail.RoF,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);

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

/* ½b */
export class arrow {
    constructor(pos = new Vec2(0, 0)) {
        this.type = 'arrow';
        this.pos = pos;

        this.detail = {
            name: 'arrow',
            direction: 'up',
        };

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
    detailFunction() {
        return {
            name: { type: 'text' },
            direction: { type: 'select', options: ['up', 'down', 'left', 'right'] },
        };
    }
    enpackage() {
        return {
            type: this.type,
            pos: { x: this.pos.x, y: this.pos.y },

            name: this.detail.name,
            direction: this.detail.direction,
        };
    }
    unpackage(objectSetting) {
        this.type = objectSetting.type;
        this.pos = new Vec2(objectSetting.pos.x, objectSetting.pos.y);

        this.detail.name = objectSetting.name;
        this.detail.direction = objectSetting.direction;

        this.perspective = true;
    }
    update(frames = 1) {
        this.life += frames;
        if (this.life >= this.maxlife) return { type: 'destory' };
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

/*
export class ObjectName {
	constructor(pos = new Vec2(0, 0)) {
		this.type = 'ObjectName';
		this.pos = pos;

		this.detail = {
			name: 'ObjectName'
		};

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
			pos: { x: this.pos.x, y: this.pos.y },

			name: this.detail.name,
		};
	}
	unpackage(objectSetting) {
		this.type = objectSetting.type;
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