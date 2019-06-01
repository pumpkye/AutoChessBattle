import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, BuffAndDotState, DamageType } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { ChessBuff } from "../Model/ChessBuff";
import { skillEffects } from "./InitSkillEffect";
/**
 * 咆哮，对周围[0]格目标造成[1]点伤害和眩晕，持续[2]秒
 */
export class Roar extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.roar;
    }
    public get effName(): string {
        return "roar";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let range = data.skillEff.effArr[0];
        let damage = data.skillEff.effArr[1]
        let lifeTime = data.skillEff.effArr[2];

        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.damage, [damage, DamageType.magic]);
        let hitNpc = this.getRandomNpc(g_AutoBattleManager.getEnemyList(data.attacker), 100, range, { x: data.attacker.posX, y: data.attacker.posY });
        for (let i = 0; i < hitNpc.length; i++) {
            const defender = hitNpc[i];
            let effData = new EffData(effInfo, data.attacker, defender);
            skillEffects[SkillEffectEnum.damage].play(effData);
            // 眩晕
            let buff = new ChessBuff(lifeTime, 0, defender, null, BuffAndDotState.coma);
            defender.addBuff(buff);
        }
        return true;
    }
}