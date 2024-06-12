import { Graphics, Container } from 'pixi.js';
import { HEIGHT, WIDTH, OUT_OF_RANGE_DIST, MOMENT} from './config.ts';

function calcRotate(mx: number, my: number) {
    let angle = Math.atan(mx / my)
    if (my < 0) angle += Math.PI
    return angle
}

class Movement {
    container: Container;
    moment_x: number;
    moment_x_add: number = 0;
    moment_y: number;
    moment_y_add: number = 0;

    constructor(
        container: Container,
        moment_x: number = 0,
        moment_y: number = 1,
    ) {
        this.container = container
        this.moment_x = moment_x;
        this.moment_y = moment_y;
        this.toward()
    }

    toward() {       
        // this.moment_x_add = this.moment_x_add / Math.sqrt(Math.pow(this.moment_x_add, 2) + Math.pow(this.moment_y_add, 2))
        // this.moment_y_add = this.moment_y_add / Math.sqrt(Math.pow(this.moment_x_add, 2) + Math.pow(this.moment_y_add, 2))
        
        // this.moment_x = this.moment_x * MOMENT + this.moment_x_add * (1 - MOMENT)
        // this.moment_y = this.moment_y * MOMENT + this.moment_y_add * (1 - MOMENT)

        this.moment_x = this.moment_x / Math.sqrt(Math.pow(this.moment_x, 2) + Math.pow(this.moment_y, 2))
        this.moment_y = this.moment_y / Math.sqrt(Math.pow(this.moment_x, 2) + Math.pow(this.moment_y, 2))

        this.container.rotation = calcRotate(this.moment_x, this.moment_y);
    }

    public get localCenter() {
        const mountBirdBounds = this.container.getLocalBounds()
        return {
            x: mountBirdBounds.x + mountBirdBounds.width / 2,
            y: mountBirdBounds.y + mountBirdBounds.height / 2,
        }
    }

    move(speed = 0.1) {
        this.toward()
        this.container.x += speed * this.moment_x
        this.container.y += speed * -this.moment_y

        //出界检查
        if (this.container.x > WIDTH + OUT_OF_RANGE_DIST) this.container.x = -OUT_OF_RANGE_DIST;
        if (this.container.x < -OUT_OF_RANGE_DIST) this.container.x = WIDTH + OUT_OF_RANGE_DIST;
        if (this.container.y > HEIGHT + OUT_OF_RANGE_DIST) this.container.y = -OUT_OF_RANGE_DIST;
        if (this.container.y < -OUT_OF_RANGE_DIST) this.container.y = HEIGHT + OUT_OF_RANGE_DIST;
    }

}

export class Entity {
    serial_number: number;

    container: Container
    movement: Movement;
    permenant_graphic: Graphics;

    constructor(seq: number, x: number, y: number, mx: number, my: number) {
        console.info(`[Entity ${seq}] ${x} - ${y}`)
        this.serial_number = seq;
        this.container = new Container({ zIndex: 1, x: x, y: y });
        this.movement = new Movement(this.container, mx, my);
        this.permenant_graphic = new Graphics({ zIndex: 3, parent: this.container });
    }
}
