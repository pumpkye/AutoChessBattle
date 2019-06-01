import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, DamageType, BuffAndDotState } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { skillEffects } from "./InitSkillEffect";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 对目标和周边[0]格的[1]个单位造成[2]点伤害，并在随后的[3]秒时间内沉默被击中的目标
 */
export class ChainLightning extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.chainLightning;
    }
    public get effName(): string {
        return "chainLightning";
    }

    public play(data: EffData): boolean {
        super.play(data);

        let range = data.skillEff.effArr[0];
        let count = data.skillEff.effArr[1];
        let damage = data.skillEff.effArr[2];
        let lifeTime = data.skillEff.effArr[3];

        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.damage, [damage, DamageType.magic]);
        let hitNpc = this.getRandomNpc(g_AutoBattleManager.getEnemyList(data.attacker), count, range, { x: data.defender.posX, y: data.defender.posY });
        for (let i = 0; i < hitNpc.length; i++) {
            const defender = hitNpc[i];
            let effData = new EffData(effInfo, data.attacker, defender);
            skillEffects[SkillEffectEnum.damage].play(effData);
            //沉默
            let chessBuff = new ChessBuff(lifeTime, 0, defender, null, BuffAndDotState.silent);
            defender.addBuff(chessBuff);
        }
        return true;
    }
}