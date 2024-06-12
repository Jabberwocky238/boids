import { ALIGNMENT_RATE } from "../config";
import { Entity } from "../entity";
import { L2 } from "../utils";

function steerAlignment(thisEntity: Entity, entityInRange: Entity[]) {
    entityInRange.forEach(entity => {
        const forceX = entity.container.x - thisEntity.container.x;
        const forceY = entity.container.y - thisEntity.container.y;
        const distance = L2(forceX, forceY)
        thisEntity.movement.moment_x_add += entity.movement.moment_x * forceX / distance * ALIGNMENT_RATE
        thisEntity.movement.moment_y_add += entity.movement.moment_y * forceY / distance * ALIGNMENT_RATE
    })
}


export default steerAlignment;