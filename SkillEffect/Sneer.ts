import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, BuffAndDotState } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { ChessBuff } from "../Model/ChessBuff";
import { skillEffects } from "./InitSkillEffect";

/**
 * 嘲讽，使得周围[0]范围内的所有目标强制攻击自己[1]秒,同时提升自己的护甲[2]点,被嘲讽的目标期间无法释放技能，若嘲讽者死亡，则被嘲讽效果直接结束
 */
export class Sneer extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.sneer;
    }

    public get effName(): string {
        return "sneer";
    }

    /**
     * play
     */
    public play(data: EffData): boolean {
        let attacker = data.attacker;
        if (!attacker || attacker.isDead) {
            return false;
        }
        let skillEff = data.skillEff;
        let range = skillEff.effArr[0];
        let lifeTime = skillEff.effArr[1];
        let defence = skillEff.effArr[2];

        //增加自身护甲
        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.addDefence, [defence, lifeTime]);
        let effData = new EffData(effInfo, attacker, attacker);
        skillEffects[SkillEffectEnum.addDefence].play(effData);

        //周围目标被嘲讽
        effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.sneer);
        let hitList = this.getRandomNpc(g_AutoBattleManager.getEnemyList(attacker), 100,
            range, { x: attacker.posX, y: attacker.posY });
        for (let i = 0; i < hitList.length; i++) {
            const defender = hitList[i];
            defender.setTarget(attacker);
            let effData = new EffData(effInfo, attacker, defender);
            let chessBuff = new ChessBuff(lifeTime, 0, defender, effData, BuffAndDotState.beSneer);
            defender.addBuff(chessBuff);
        }
        return true;
    }
}