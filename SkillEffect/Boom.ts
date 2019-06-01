import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { AttrChangeInfo } from "../Model/ChessBuff";
/**
 *  boom，死亡时造成伤害并眩晕[0]秒，伤害数值为其之前造成的伤害的[1]%，该伤害结算会在该单位死亡之前
 */
export class Boom extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.boom;
    }
    public get effName(): string {
        return "boom";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return;
        }
        // let range = data.skillEff.effArr[0];
        let comaTime = data.skillEff.effArr[0];
        let damagePer = data.skillEff.effArr[1];
        data.defender.addAttrChange("boom", new AttrChangeInfo({ comaTime: comaTime, damagePer: damagePer }));
        return true;
    }
}