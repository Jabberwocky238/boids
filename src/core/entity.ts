import { Sprite, Graphics, Container } from 'pixi.js';
import { PERCEPT_RANGE, SCALE_RATE, DEBUG_SERIAL } from './config.ts';
import { Movement } from './movement.ts';
import { useBIRD_LIST } from './main.ts';
import { euclideanDistance } from './utils.ts';

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
        moment_x: number = 1,
        moment_y: number = -1,
    ) {
        console.info(`[bird ${seq}] ${pos_x} - ${pos_y}`)
        this.serial_number = seq;
        this.container = new Container({ zIndex: 1, x: pos_x, y: pos_y });
        this.movement = new Movement(this.container, moment_x, moment_y);
        
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
        this.permenant_graphic = new Graphics({ zIndex: 3, parent: this.container });
        this.permenant_graphic.rect(_x, _y, _w, _h)
        this.permenant_graphic.stroke({ color: 0x00ff00, width: 2 }); // 设置线条样式

        DEBUG_SERIAL.forEach(debug_item => {
            if (this.serial_number === debug_item.serial_number) {
                this.permenant_graphic.circle(this.movement.localCenter.x, this.movement.localCenter.y, PERCEPT_RANGE);
                this.permenant_graphic.fill({ color: debug_item.color, alpha: 0.5 });

                const temporary_graphic = new Graphics({ zIndex: 10, parent: this.container });
                temporary_graphic.label = 'temporary_graphic'
                this.container.addChild(temporary_graphic);
            }
        })
    }

    rangeCheck(birdInRange: Entity[]) {
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
    
    move() {
        const BIRD_LIST = useBIRD_LIST()
        var birdInRange = BIRD_LIST.filter(bird => {
            const judge1 = bird !== this;
            const judge2 = euclideanDistance(this.container.x, this.container.y, bird.container.x, bird.container.y)
            return judge1 && judge2 < PERCEPT_RANGE;
        })
        this.rangeCheck(birdInRange);
        this.movement.move();
    }
}
