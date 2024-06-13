import { ALIGNMENT_RATE } from "../config";
import { Entity } from "../entity";
import { L2 } from "../utils";

function steerAlignment(thisEntity: Entity, entityInRange: Entity[]) {
    let _x = 0
    let _y = 0
    entityInRange.forEach(entity => {
        const forceX = entity.container.x - thisEntity.container.x;
        const forceY = entity.container.y - thisEntity.container.y;
        const distance = L2(forceX, forceY)
        _x += entity.movement.moment_x / distance 
        _y += entity.movement.moment_y / distance 
    })
    thisEntity.movement.moment_x_add += _x * ALIGNMENT_RATE;
    thisEntity.movement.moment_y_add += _y * ALIGNMENT_RATE;
}


export default steerAlignment;