import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, DamageType } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { skillEffects } from "./InitSkillEffect";
/**
 *  嗜血之矛debuff，造成[0]点纯粹伤害，并为攻击者回复同等血量
 */
export class BloodthirstySpearBuff extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.bloodthirstySpearBuff;
    }
    public get effName(): string {
        return "bloodthirstySpearBuff";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return false;
        }

        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.damage, [data.skillEff.effArr[0], DamageType.real]);
        let effect = new EffData(effInfo, data.attacker, data.defender);
        skillEffects[SkillEffectEnum.damage].play(effect);
        if (data.attacker && !data.attacker.isDead) {
            data.attacker.reduceHp(-data.skillEff.effArr[0]);
        }
        return true;
    }
}