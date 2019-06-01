import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, BuffAndDotState } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 放逐，使当前目标无法攻击，也不会受到物理伤害，但是受到[0]%的魔法伤害，持续[1]秒
 */
export class Banish extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.banish;
    }
    public get effName(): string {
        return "banish";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return;
        }
        let mdPer = data.skillEff.effArr[0];
        let lifeTime = data.skillEff.effArr[1];
        let buff = new ChessBuff(lifeTime, 0, data.defender, null, BuffAndDotState.beBanish);
        buff.setAttrChange("banish", mdPer);
        data.defender.addBuff(buff);
        return true;
    }
}