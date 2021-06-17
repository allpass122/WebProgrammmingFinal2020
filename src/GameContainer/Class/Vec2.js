/* 二維向量 class 定義 */
export default class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    init() {
        this.x = 0;
        this.y = 0;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Vec2(this.x, this.y);
    }
    equal(v) {
        return (this.x === v.x && this.y === v.y);
    }
    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }
    mul(c) {
        return new Vec2(this.x * c, this.y * c);
    }
    div(c) {
        return new Vec2(this.x / c, this.y / c);
    }
    length() { 
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    unit() { // 回傳單位向量
        if (this.length() === 0) return this;
        return this.div(this.length());
    }
    dot(v) { // 計算內積
        return this.x * v.x + this.y * v.y;
    }
    cross(v) { // 計算外積
        return this.x * v.y - this.y * v.x;
    }
    between(v1, v2) { // 在兩點圍出的矩形空間內
        return this.x >= Math.min(v1.x, v2.x) && this.x <= Math.max(v1.x, v2.x) && this.y >= Math.min(v1.y, v2.y) && this.y <= Math.max(v1.y, v2.y);
    }
    toGrid(w) { // 回傳將座標以 w 為寬度單位轉成網格座標
        return new Vec2(~~(this.x / w), ~~(this.y / w));
    }
    static leftUp(v1, v2) { // 回傳兩點圍成的矩形的左上座標
        return new Vec2(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y));
    }
    static rightDown(v1, v2) { // 回傳兩點圍成的矩形的右下座標
        return new Vec2(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y));
    }
}
