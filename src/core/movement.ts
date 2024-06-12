import { Container } from 'pixi.js';
import { HEIGHT, WIDTH, OUT_OF_RANGE_DIST, MOMENT, SPEED } from './config.ts';

function calcRotate(mx: number, my: number) {
    let angle = Math.atan(mx / my)
    if (my < 0) angle += Math.PI
    return angle
}

function L2(x: number, y: number) {
    const res = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) 
    return res === 0 ? 1 : res
}

export class Movement {
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
        this.moment_x_add = this.moment_x_add / L2(this.moment_x_add, this.moment_y_add)
        this.moment_y_add = this.moment_y_add / L2(this.moment_x_add, this.moment_y_add)
        // console.log(this.moment_x_add, this.moment_y_add)
        
        this.moment_x = this.moment_x * MOMENT + this.moment_x_add * (1 - MOMENT)
        this.moment_y = this.moment_y * MOMENT + this.moment_y_add * (1 - MOMENT)
        // console.log(this.moment_x, this.moment_y)
        
        this.moment_x = this.moment_x / L2(this.moment_x, this.moment_y)
        this.moment_y = this.moment_y / L2(this.moment_x, this.moment_y)
        // console.log(this.moment_x, this.moment_y)

        this.moment_x_add = 0
        this.moment_y_add = 0

        this.container.rotation = calcRotate(this.moment_x, this.moment_y);
    }

    public get localCenter() {
        const mountBirdBounds = this.container.getLocalBounds()
        return {
            x: mountBirdBounds.x + mountBirdBounds.width / 2,
            y: mountBirdBounds.y + mountBirdBounds.height / 2,
        }
    }

    move() {
        this.toward()
        this.container.x += SPEED * this.moment_x
        this.container.y += SPEED * -this.moment_y

        //出界检查
        if (this.container.x > WIDTH + OUT_OF_RANGE_DIST) this.container.x = -OUT_OF_RANGE_DIST;
        if (this.container.x < -OUT_OF_RANGE_DIST) this.container.x = WIDTH + OUT_OF_RANGE_DIST;
        if (this.container.y > HEIGHT + OUT_OF_RANGE_DIST) this.container.y = -OUT_OF_RANGE_DIST;
        if (this.container.y < -OUT_OF_RANGE_DIST) this.container.y = HEIGHT + OUT_OF_RANGE_DIST;
    }

}