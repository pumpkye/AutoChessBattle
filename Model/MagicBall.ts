/**
 * 魔法弹道球
 */
enum TargetType {
    /**
     * 指向一个点，最常见的目标类型
     */
    point,
    /**
     * 指向一个方向，
     */
    dir,
}

export class MagicBall {
    targetType = TargetType.point;


    constructor() {
    }

}