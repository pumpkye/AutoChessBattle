import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff, AttrChangeInfo } from "../Model/ChessBuff";

/**
 * 增加魔抗[0]点，持续[1]秒
 */
export class AddMDefence extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.addMDefence;
    }

    public get effName(): string {
        return "addMDefence";
    }

    play(data: EffData) {
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let addMDefence = data.skillEff.effArr[0];
        let lifeTime = data.skillEff.effArr[1];
        if (lifeTime != 0) {
            let buff = new ChessBuff(lifeTime, 0, defender);
            buff.setAttrChange("mDefence", addMDefence);
            defender.addBuff(buff);
        } else {
            defender.addAttrChange("mDefence", new AttrChangeInfo(addMDefence));
        }
        return true;
    }
}