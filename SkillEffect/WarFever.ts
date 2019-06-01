import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { AttrChangeInfo } from "../Model/ChessBuff";
/**
 * 每百分之一的血量损失提供[0]点的攻速提升和[1]点的魔抗
 */
export class WarFever extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.warFever;
    }
    public get effName(): string {
        return "warFever";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return;
        }

        let attackSpeed = data.skillEff.effArr[0];
        let mDefence = data.skillEff.effArr[1];
        data.defender.addAttrChange("warFever", new AttrChangeInfo({ attackSpeed: attackSpeed, mDefence: mDefence }));
        return true;
    }
}