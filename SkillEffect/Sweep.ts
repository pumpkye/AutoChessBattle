import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, DamageType } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { skillEffects } from "./InitSkillEffect";
import { g_AutoBattleManager } from "../AutoBattleManager";
/**
 * 横扫，对目标造成[0]倍普通攻击的物理伤害，对目标周围[1]格的目标造成[2]倍普通攻击的物理伤害
 */
export class Sweep extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.sweep;
    }
    public get effName(): string {
        return "sweep";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let per1 = data.skillEff.effArr[0];
        let range = data.skillEff.effArr[1];
        let per2 = data.skillEff.effArr[2];

        let damage1 = data.attacker.damage * per1;
        let damage2 = data.attacker.damage * per2;

        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.damage, [damage1, DamageType.normal]);
        let effData = new EffData(effInfo, data.attacker, data.defender);
        skillEffects[SkillEffectEnum.damage].play(effData);

        effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.damage, [damage2, DamageType.normal]);
        let hitNpc = this.getRandomNpc(g_AutoBattleManager.getEnemyList(data.attacker), 100, range, { x: data.defender.posX, y: data.defender.posY });
        for (let i = 0; i < hitNpc.length; i++) {
            const defender = hitNpc[i];
            if (defender.thisId != data.defender.thisId) {
                let effData = new EffData(effInfo, data.attacker, defender);
                skillEffects[SkillEffectEnum.damage].play(effData);
            }
        }
        return true;
    }
}