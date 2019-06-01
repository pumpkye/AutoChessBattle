import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { AttrChangeInfo } from "../Model/ChessBuff";
/**
 *  法力燃烧，每次普攻都会削减目标[0]点魔法，并且造成削减魔法量[1]%的伤害
 */
export class ManaBurn extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.manaBurn;
    }
    public get effName(): string {
        return "manaBurn";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return;
        }
        let mana = data.skillEff.effArr[0];
        let damagePer = data.skillEff.effArr[1];
        data.defender.addAttrChange("manaBurn", new AttrChangeInfo({ mana: mana, damagePer: damagePer }));
        return true;
    }
}