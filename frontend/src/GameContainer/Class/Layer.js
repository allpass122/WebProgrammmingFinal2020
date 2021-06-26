const maxLayer = 5;

export default class Layer {
    constructor(...status) { // new Layer(0, 1, 3) 創造佔據層數 0, 1, 3 的物件
        this.status = [false, false, false, false, false];
        if (status.length !== 0) this.fill(...status);
    }
    fill(...targets) { // fill(2, 4) 把層數 2, 4 佔據 (預設為全部填滿) * 屬強制覆蓋
        if (targets.length !== 0) {
            for (let i = 0; i < targets.length; i++) {
                if (targets[i] < maxLayer && targets[i] >= 0) {
                    this.status[targets[i]] = true;
                }
            }
        } else this.status = [true, true, true, true, true];
    }
    clear(...targets) { // claer(0, 1, 3) 把層數 0, 1, 3 解除佔據 (預設為全部清空) * 屬強制清空
        if (targets.length !== 0) {
            for (let i = 0; i < targets.length; i++) {
                if (targets[i] < maxLayer && targets[i] >= 0) {
                    this.status[targets[i]] = false;
                }
            }
        } else this.status = [false, false, false, false, false];
    }
    isOverlap(that) { // 確認是否兩個層數物件是否重疊
        for (let i = 0; i < maxLayer; i++) {
            if (this.status[i] && that.status[i]) return true;
        }
        return false;
    }
    add(that) { // 將物件的層數疊加 * 必須屬於非重疊物件才可以疊加
        if (this.isOverlap(that)) return false;
        for (let i = 0; i < maxLayer; i++) {
            if (that.status[i]) this.status[i] = true;
        }
        return true;
    }
    sub(that) { // 將物件的層數消除
        for (let i = 0; i < maxLayer; i++) {
            if (that.status[i]) this.status[i] = false;
        }
    } 
    clone() { 
        let status = [];
        for (let i = 0; i < maxLayer; i++) {
            if (this.status[i]) status.push(i);
        }
        return new Layer(...status);
    }
    top() { // 回傳被佔據最高層所在層數
        for (let i = 0; i < maxLayer; i++) {
            if (this.status[maxLayer - 1 - i]) return maxLayer - 1 - i;
        }
        return -1;
    }
    bottom() { // 回傳被佔據最底層所在層數
        for (let i = 0; i < maxLayer; i++) {
            if (this.status[i]) return i;
        }
        return -1;
    }
}
