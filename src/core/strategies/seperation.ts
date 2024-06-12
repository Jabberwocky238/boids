import { PERCEPT_RANGE } from "../config";
import { Entity } from "../entity";

function euclideanDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function L2(x: number, y: number) {
    const res = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) 
    return res === 0 ? 1 : res
}

function steerSeparation(thisEntity: Entity, entityInRange: Entity[]) {
    entityInRange.forEach(entity => {
        const forceX = entity.container.x - thisEntity.container.x;
        const forceY = entity.container.y - thisEntity.container.y;
        const distance = L2(forceX, forceY)
        // const steer = (forceX + forceY) / distance;
        // console.log(forceX  / distance, forceY  / distance)
        thisEntity.movement.moment_x_add -= forceX / distance 
        thisEntity.movement.moment_y_add += forceY / distance 
    })
}

export default steerSeparation; 

