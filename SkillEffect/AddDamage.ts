import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff, AttrChangeInfo } from "../Model/ChessBuff";
/**
 * 增加攻击力[0]点，持续[1]秒
 */
export class AddDamage extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.addDamage;
    }
    public get effName(): string {
        return "addDamage";
    }

    public play(data: EffData): boolean {
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let addDamage = data.skillEff.effArr[0];
        let lifeTime = data.skillEff.effArr[1];
        if (lifeTime != 0) {
            let buff = new ChessBuff(lifeTime, 0, defender);
            buff.setAttrChange("damage", addDamage);
            defender.addBuff(buff);
        } else {
            defender.addAttrChange("damage", new AttrChangeInfo(addDamage));
        }
        return true;
    }
}
