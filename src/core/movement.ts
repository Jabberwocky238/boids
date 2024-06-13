import { Container } from 'pixi.js';
import { HEIGHT, WIDTH, OUT_OF_RANGE_DIST, MOMENT, SPEED } from './config.ts';
import { L2 } from './utils.ts';

function calcRotate(mx: number, my: number) {
    if (my === 0) return 0
    let angle = Math.atan(mx / my)
    if (my < 0) angle += Math.PI
    return angle
}
function radius(x: number) {
    return x / Math.PI * 180;
}
function anti_radius(x: number) {
    return x / 180 * Math.PI;
}
/**
 * Movement
 * x: - y: - | x: + y: - 
 * ----------|-----------
 * x: - y: + | x: + y: + 
 */
export class Movement {
    container: Container;
    moment_x: number;
    moment_x_add: number = 0;
    moment_y: number;
    moment_y_add: number = 0;

    constructor(
        container: Container,
        to: number,
    ) {
        this.container = container
        this.container.rotation = anti_radius(to)
        this.moment_x = Math.sin(this.container.rotation)
        this.moment_y = Math.cos(this.container.rotation)
        this.toward()
    }

    toward() {       
        this.moment_x_add = this.moment_x_add / L2(this.moment_x_add, this.moment_y_add)
        this.moment_y_add = this.moment_y_add / L2(this.moment_x_add, this.moment_y_add)
        const new_direction = calcRotate(this.moment_x_add, this.moment_y_add);
        this.container.rotation += (1 - MOMENT) * new_direction
        // // console.log(this.moment_x_add, this.moment_y_add)
        
        this.moment_x = Math.sin(this.container.rotation)
        this.moment_y = Math.cos(this.container.rotation)
        // // console.log(this.moment_x, this.moment_y)
        
        // this.moment_x = this.moment_x / L2(this.moment_x, this.moment_y)
        // this.moment_y = this.moment_y / L2(this.moment_x, this.moment_y)
        // // console.log(this.moment_x, this.moment_y)

        this.moment_x_add = 0
        this.moment_y_add = 0
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