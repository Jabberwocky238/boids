export function euclideanDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function L2(x: number, y: number) {
    const res = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) 
    return res === 0 ? 1 : res
}