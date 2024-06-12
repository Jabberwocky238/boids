steerCohesion(birdInRange: BirdEntity[]) {
    let center_x = this.container.x;
    let center_y = this.container.y;
    let cnt = 1

    birdInRange.forEach(bird => {
        center_x += bird.container.x
        center_y += bird.container.y
        cnt += 1            
    })

    if (cnt === 1) return;

    const globalCenter = new Point(center_x / cnt, center_y / cnt)
    const localCenter = this.container.toLocal(globalCenter)

    this.movement.moment_x_add += localCenter.x / PERCEPT_RANGE * COHESION_RATE ;
    this.movement.moment_y_add += localCenter.y / PERCEPT_RANGE * COHESION_RATE ;

    DEBUG_SERIAL.forEach(debug_item => {
        if (this.serial_number === debug_item.serial_number) {
            const temporary_graphic: Graphics = this.container.getChildByLabel('temporary_graphic') as Graphics;
            temporary_graphic.circle(localCenter.x, localCenter.y, 20);
            temporary_graphic.fill({ color: debug_item.color, alpha: 0.5 });
        }
    })
}