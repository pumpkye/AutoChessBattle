import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, BuffAndDotState } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 闷棍，使目标眩晕[0]秒
 */
export class Bang extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.bang;
    }
    public get effName(): string {
        return "bang";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return false;
        }
        let lifeTime = data.skillEff.effArr[0];

        let buff = new ChessBuff(lifeTime, 0, data.defender, null, BuffAndDotState.coma);
        data.defender.addBuff(buff);
        return true;
    }
}