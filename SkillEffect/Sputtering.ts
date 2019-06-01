import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../model/EffectInfo";
import { AttrChangeInfo } from "../Model/ChessBuff";
/**
 *  溅射，对目标周围[0]格单位造成[1]%伤害
 */
export class Sputtering extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.sputtering;
    }
    public get effName(): string {
        return "sputtering";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return false;
        }
        let range = data.skillEff.effArr[0];
        let damagePer = data.skillEff.effArr[1];
        data.defender.addAttrChange("sputtering", new AttrChangeInfo({ range, damagePer }));
        return true;
    }
}