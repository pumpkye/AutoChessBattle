import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff, AttrChangeInfo } from "../Model/ChessBuff";
/**
 * 普通攻击有[0]几率造成[1]%的暴击伤害
 */
export class Crit extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.crit;
    }
    public get effName(): string {
        return "crit";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let per = data.skillEff.effArr[0];
        let mul = data.skillEff.effArr[1];
        defender.addAttrChange("crit", new AttrChangeInfo({ per: per, mul: mul }));
        // defender.addBuff(buff);
        return true;
    }
}