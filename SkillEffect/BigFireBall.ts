import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, DamageType, BuffAndDotState } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { skillEffects } from "./InitSkillEffect";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 炎爆，对目标和周围[0]格单位造成[1]点伤害[2]秒眩晕
 */
export class BigFireBall extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.bigFireBall;
    }
    public get effName(): string {
        return "bigFireBall";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let range = data.skillEff.effArr[0];
        let damage = data.skillEff.effArr[1]
        let lifeTime = data.skillEff.effArr[2];

        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.damage, [damage, DamageType.magic]);
        let hitNpc = this.getRandomNpc(g_AutoBattleManager.getEnemyList(data.attacker), 100, range, { x: data.defender.posX, y: data.defender.posY });
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