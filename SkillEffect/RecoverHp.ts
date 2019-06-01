import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
/**
 * 回复[0]点血量
 */
export class RecoverHp extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.recoverHp;
    }
    public get effName(): string {
        return "recoverHp";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return false;
        }
        data.defender.hp = data.defender.getHp() + data.skillEff.effArr[0];
        return true;
    }
}