import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, DamageType } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { skillEffects } from "./InitSkillEffect";

/**
 * 对[0]范围内[1]个目标造成[2]点魔法伤害
 */
export class CircleDamage extends BaseSkillEffect {
    constructor() {
        super();
    }

    public get effectId(): number {
        return SkillEffectEnum.circleDamage;
    }

    public get effName(): string {
        return "circleDamage";
    }

    /**
     * play
     */
    public play(data: EffData): boolean {
        super.play(data);
        let skillEff = data.skillEff;
        let range = skillEff.effArr[0];
        let count = skillEff.effArr[1];
        let damage = skillEff.effArr[2];

        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.damage, [damage, DamageType.magic]);
        let hitNpc = this.getRandomNpc(g_AutoBattleManager.getEnemyList(data.attacker), count, range, { x: data.defender.posX, y: data.defender.posY });
        for (let i = 0; i < hitNpc.length; i++) {
            const defender = hitNpc[i];
            let effData = new EffData(effInfo, data.attacker, defender);
            skillEffects[SkillEffectEnum.damage].play(effData);
        }
        return true;
    }
}