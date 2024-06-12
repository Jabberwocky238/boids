import { SEPERATE_RATE } from "../config";
import { Entity } from "../entity";
import { L2 } from "../utils";


function steerSeparation(thisEntity: Entity, entityInRange: Entity[]) {
    entityInRange.forEach(entity => {
        const forceX = entity.container.x - thisEntity.container.x;
        const forceY = entity.container.y - thisEntity.container.y;
        const distance = L2(forceX, forceY)
        // const steer = (forceX + forceY) / distance;
        // console.log(forceX  / distance, forceY  / distance)
        thisEntity.movement.moment_x_add += forceX / distance * SEPERATE_RATE
        thisEntity.movement.moment_y_add += forceY / distance * SEPERATE_RATE
    })
}

export default steerSeparation; 

