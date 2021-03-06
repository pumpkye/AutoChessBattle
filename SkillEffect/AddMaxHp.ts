import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff, AttrChangeInfo } from "../Model/ChessBuff";

/**
 * 增加生命值[0]点，持续[1]秒
 */
export class AddMaxHp extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.addMaxHp;
    }

    public get effName(): string {
        return "addMaxHp";
    }

    /**
     * play
     */
    public play(data: EffData): boolean {
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let addMaxHp = data.skillEff.effArr[0];
        let lifeTime = data.skillEff.effArr[1];
        if (lifeTime != 0) {
            let buff = new ChessBuff(lifeTime, 0, defender);
            buff.setAttrChange("maxHp", addMaxHp);
            defender.addBuff(buff);
        } else {
            defender.addAttrChange("maxHp", new AttrChangeInfo(addMaxHp));
        }
        return true;
    }

}