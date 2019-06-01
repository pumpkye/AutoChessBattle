import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff, AttrChangeInfo } from "../Model/ChessBuff";
/**
 * 增加攻速[0]点，持续[1]秒
 */
export class AddAttackSpeed extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.addAttackSpeed;
    }
    public get effName(): string {
        return "addAttackSpeed";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let attackSpeed = data.skillEff.effArr[0];
        let lifeTime = data.skillEff.effArr[1];
        if (lifeTime != 0) {
            let buff = new ChessBuff(lifeTime, 0, defender);
            buff.setAttrChange("attackSpeed", attackSpeed);
            defender.addBuff(buff);
        } else {
            defender.addAttrChange("attackSpeed", new AttrChangeInfo(attackSpeed));
        }
        return true;
    }
}