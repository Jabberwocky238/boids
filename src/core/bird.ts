import { PERCEPT_RANGE, SCALE_RATE, DEBUG_SERIAL } from './config.ts';
import { useBIRD_LIST } from './main.ts';
import { Entity } from './entity.ts';
import steerSeparation from './strategies/seperation.ts'

function euclideanDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export class Bird extends Entity {
    constructor(
        seq: number,
        pos_x: number = 100,
        pos_y: number = 100,
        moment_x: number = 1,
        moment_y: number = -1,
    ) {
        console.info(`[bird ${seq}] ${pos_x} - ${pos_y}`)
        super(seq, pos_x, pos_y, moment_x, moment_y)
    }

    move() {
        const BIRD_LIST = useBIRD_LIST()
        var birdInRange = BIRD_LIST.filter(bird => {
            const judge1 = bird !== this;
            const judge2 = euclideanDistance(this.container.x, this.container.y, bird.container.x, bird.container.y)
            return judge1 && judge2 < PERCEPT_RANGE;
        })
        steerSeparation(this, birdInRange)
        this.rangeCheck(birdInRange);
        this.movement.move();
    }
}
