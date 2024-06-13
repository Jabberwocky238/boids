import { Sprite, Graphics, Container } from 'pixi.js';
import { PERCEPT_RANGE, SCALE_RATE, DEBUG_SERIAL } from './config.ts';
import { Movement } from './movement.ts';
import { useBIRD_LIST } from './main.ts';
import { euclideanDistance } from './utils.ts';

function inRange(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) < PERCEPT_RANGE;
}
function radius(x: number) {
    return x / Math.PI * 180;
}
function rpositive(x: number) {
    return x < 0 ? 360 + x : x;
}
function projection(me: Entity, bird: Entity) {
    const localPosition = {
        x: bird.container.x - me.container.x,
        y: bird.container.y - me.container.y
    }
    let theta = Math.atan(localPosition.y / localPosition.x)
    let alpha = Math.atan(me.movement.moment_y / me.movement.moment_x)
    if (localPosition.x < 0){
        // theta = -theta;
        theta = Math.PI + theta;
    }
    if (me.movement.moment_x < 0){
        // alpha = -alpha;
        alpha = Math.PI - alpha;
    }
    // console.log()
    const ultimate = rpositive(radius(theta) - radius(alpha))
    // console.log("y", localPosition.y, "x", localPosition.x, "theta", radius(theta), "alpha", radius(alpha), "ultimate", ultimate)
    return ultimate <= 120 || ultimate >= 240;
}

function inVisionCone(me: Entity, bird: Entity) {
    return projection(me, bird);
}

export class Entity {
    serial_number: number;

    container: Container
    movement: Movement;

    permenant_graphic: Graphics;
    sprite: Sprite;

    constructor(
        seq: number,
        pos_x: number = 100,
        pos_y: number = 100,
        to: number = 45,
    ) {
        this.serial_number = seq;
        this.container = new Container({ zIndex: 1, x: pos_x, y: pos_y });
        this.movement = new Movement(this.container, to);
        
        this.sprite = Sprite.from('sample.png');
        this.sprite.zIndex = 5;
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(SCALE_RATE);
        this.container.addChild(this.sprite);

        const mountBirdBounds = this.sprite.getBounds();
        const _w = mountBirdBounds.width * 0.5
        const _x = this.movement.localCenter.x - _w / 2
        const _h = mountBirdBounds.height * 0.5
        const _y = this.movement.localCenter.y - _h / 2
        // console.log(_x, _y, _w, _h, mountBirdBounds)
        this.permenant_graphic = new Graphics({ zIndex: 5, parent: this.container });
        this.permenant_graphic.rect(_x, _y, _w, _h)
        this.permenant_graphic.stroke({ color: 0x00ff00, width: 2 }); // 设置线条样式

        DEBUG_SERIAL.forEach(debug_item => {
            if (this.serial_number === debug_item.serial_number) {
                this.permenant_graphic.circle(this.movement.localCenter.x, this.movement.localCenter.y, PERCEPT_RANGE);
                this.permenant_graphic.fill({ color: debug_item.color, alpha: 0.5 });

                const temporary_graphic = new Graphics({ zIndex: 2, parent: this.container });
                temporary_graphic.label = 'temporary_graphic'
                this.container.addChild(temporary_graphic);
            }
        })
    }

    Debug_rangeCheck(birdInRange: Entity[]) {
        DEBUG_SERIAL.forEach(debug_item => {
            if (this.serial_number === debug_item.serial_number) {
                const temporary_graphic: Graphics = this.container.getChildByLabel('temporary_graphic') as Graphics;
                temporary_graphic.clear()
                birdInRange.forEach(bird => {
                    const temporary_graphic: Graphics = this.container.getChildByLabel('temporary_graphic') as Graphics;
                    var thisPosition = this.container.toLocal(this.container.position);
                    var birdPosition = this.container.toLocal(bird.container.position);
                    temporary_graphic.moveTo(thisPosition.x, thisPosition.y)
                    temporary_graphic.lineTo(birdPosition.x, birdPosition.y)
                    temporary_graphic.stroke({ color: debug_item.color, width: 2 }); // 设置线条样式
                })
            }
        })
    }

    getBirdInRange(): Entity[] {
        const BIRD_LIST = useBIRD_LIST()
        return BIRD_LIST.filter((bird: Entity) => {
            const judge1 = bird !== this;
            const judge2 = inRange(this.container.x, this.container.y, bird.container.x, bird.container.y)
            const judge3 = inVisionCone(this, bird)
            return judge1 && judge2 && judge3;
        })
    }
    
    move() {
        var birdInRange = this.getBirdInRange()
        this.Debug_rangeCheck(birdInRange);
        this.movement.move();
    }
}
