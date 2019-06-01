import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, BuffAndDotState } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff, AttrChangeInfo } from "../Model/ChessBuff";
/**
 * 天神下凡，获得技能免疫，增加额外的血量[0]点，攻击力[1]点，护甲[2]点，魔抗[3]点，攻速[4]点
 */
export class GodAvatar extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.godAvatar;
    }
    public get effName(): string {
        return "godAvatar";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return;
        }
        let hp = data.skillEff.effArr[0];
        let damage = data.skillEff.effArr[1];
        let defence = data.skillEff.effArr[2]
        let mdefence = data.skillEff.effArr[3]
        let aSpeed = data.skillEff.effArr[4]

        data.defender.addAttrChange("maxHp", new AttrChangeInfo(hp));
        data.defender.addAttrChange("damage", new AttrChangeInfo(damage));
        data.defender.addAttrChange("defence", new AttrChangeInfo(defence));
        data.defender.addAttrChange("mDefence", new AttrChangeInfo(mdefence));
        data.defender.addAttrChange("attackSpeed", new AttrChangeInfo(aSpeed));
        data.defender.addBuffState(BuffAndDotState.bkb);
        return true;
    }
}