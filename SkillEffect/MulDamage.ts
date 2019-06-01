import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff, AttrChangeInfo } from "../Model/ChessBuff";
/**
 * 增加[0]%攻击力，持续[1]秒
 */
export class MulDamage extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.mulDamage;
    }
    public get effName(): string {
        return "mulDamage";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let damage = data.skillEff.effArr[0] * defender.damage / 100;
        let lifeTime = data.skillEff.effArr[1];
        if (lifeTime != 0) {
            let buff = new ChessBuff(lifeTime, 0, defender);
            buff.setAttrChange("damage", damage);
            defender.addBuff(buff);
        } else {
            defender.addAttrChange("damage", new AttrChangeInfo(damage));
        }
        return true;
    }
}