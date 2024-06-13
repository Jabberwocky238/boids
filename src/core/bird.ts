import { Entity } from './entity.ts';

import steerSeparation from './strategies/seperation.ts'
import steerAlignment from './strategies/alignment.ts';



export class Bird extends Entity {
    constructor(
        seq: number,
        pos_x: number = 100,
        pos_y: number = 100,
        to: number = 45,
    ) {
        console.info(`[bird ${seq}] ${pos_x} - ${pos_y}`)
        super(seq, pos_x, pos_y, to)
    }

    move() {
        var birdInRange = this.getBirdInRange()
        steerSeparation(this, birdInRange)
        steerAlignment(this, birdInRange)
        this.Debug_rangeCheck(birdInRange);
        this.movement.move();
    }
}
