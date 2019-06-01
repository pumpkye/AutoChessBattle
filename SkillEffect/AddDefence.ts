import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff, AttrChangeInfo } from "../Model/ChessBuff";

/**
 * 增加护甲[0]点，持续[1]秒
 */
export class AddDefence extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.addDefence;
    }

    public get effName(): string {
        return "addDefence";
    }

    /**
     * play
     */
    public play(data: EffData): boolean {
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let addDefence = data.skillEff.effArr[0];
        let lifeTime = data.skillEff.effArr[1];
        if (lifeTime != 0) {
            let buff = new ChessBuff(lifeTime, 0, defender);
            buff.setAttrChange("defence", addDefence);
            defender.addBuff(buff);
        } else {
            defender.addAttrChange("defence", new AttrChangeInfo(addDefence));
        }
        return true;
    }

}