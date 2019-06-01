import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { AttrChangeInfo } from "../Model/ChessBuff";
/**
 * 减少技能cd[0]%
 */
export class ReduceCd extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.reduceCd;
    }
    public get effName(): string {
        return "reduceCd";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let reduceCdPercent = data.skillEff.effArr[0];
        defender.addAttrChange("reduceCD", new AttrChangeInfo(reduceCdPercent));
        return true;
    }
}