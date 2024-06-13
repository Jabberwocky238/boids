import { Application, Assets } from 'pixi.js';
import { Bird } from './bird.ts';
import { BIRDS_CNT, HEIGHT, WIDTH } from './config.ts';


const BIRD_LIST: Bird[] = [];
export function useBIRD_LIST() {
    return BIRD_LIST
}

async function init(app: Application) {
    await Assets.load('sample.png');

    for (let index = 0; index < BIRDS_CNT; index++) {
        const randomX = Math.random() * WIDTH
        const randomY = Math.random() * HEIGHT
        const randomR = Math.random() * 360
        const bird = new Bird(index, randomX, randomY, randomR)
        BIRD_LIST.push(bird)
    }
    BIRD_LIST.forEach(bird => {
        app.stage.addChild(bird.container);
    })

    let elapsed = 0.0;
    // Tell our application's ticker to run a new callback every frame, passing
    // in the amount of time that has passed since the last tick
    app.ticker.add((ticker) => {
        // Add the time to our total elapsed time
        elapsed += ticker.deltaTime;
        BIRD_LIST.forEach(bird => {
            bird.move()
        })
    });
}

async function debug(app: Application) {
    await Assets.load('sample.png');

    const to = 45;
    BIRD_LIST.push(new Bird(0, 200, 200, to))
    BIRD_LIST.push(new Bird(1, 200, 290, to))
    BIRD_LIST.push(new Bird(2, 290, 200, to))
    BIRD_LIST.push(new Bird(3, 110, 200, to))
    BIRD_LIST.push(new Bird(4, 200, 110, to))
    BIRD_LIST.push(new Bird(1, 250, 250, to))
    BIRD_LIST.push(new Bird(2, 250, 150, to))
    BIRD_LIST.push(new Bird(3, 150, 250, to))
    BIRD_LIST.push(new Bird(4, 150, 150, to))
    BIRD_LIST.forEach(bird => {
        app.stage.addChild(bird.container);
    })

    let elapsed = 0.0;
    BIRD_LIST[0].move()
    // Tell our application's ticker to run a new callback every frame, passing
    // in the amount of time that has passed since the last tick
    app.ticker.add((ticker) => {
        // Add the time to our total elapsed time
        elapsed += ticker.deltaTime;
        BIRD_LIST.forEach(bird => {
            // bird.move()
        })
    });
}

async function main() {
    const app = new Application();
    await app.init({ width: WIDTH, height: HEIGHT });

    const piximount = document.getElementById('pixi')!;
    if (piximount.childNodes.length !== 0) {
        piximount.removeChild(piximount.childNodes[0])
    }
    piximount.appendChild(app.canvas);
    init(app)
    // debug(app)
}

export default main