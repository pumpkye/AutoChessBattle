import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, DamageType } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { skillEffects } from "./InitSkillEffect";
import { ChessBuff } from "../Model/ChessBuff";
/**
 *  雷霆一击, 对周围[0]格单位造成[1]点伤害，并降低[2]点攻速，持续[3]秒
 */
export class ThunderClap extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.thunderClap;
    }
    public get effName(): string {
        return "thunderClap";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let range = data.skillEff.effArr[0];
        let damage = data.skillEff.effArr[1];
        let attaSpeed = data.skillEff.effArr[2];
        let lifeTime = data.skillEff.effArr[3];

        let effectInfo = new EffectInfo();
        effectInfo.init(SkillEffectEnum.damage, [damage, DamageType.magic]);
        let hitNpc = this.getRandomNpc(g_AutoBattleManager.getEnemyList(data.attacker), 100, range, { x: data.attacker.posX, y: data.attacker.posY });
        for (let i = 0; i < hitNpc.length; i++) {
            const defender = hitNpc[i];
            let effdata = new EffData(effectInfo, data.attacker, defender);
            skillEffects[SkillEffectEnum.damage].play(effdata);
            let buff = new ChessBuff(lifeTime, 0, defender);
            buff.setAttrChange("attackSpeed", -attaSpeed);
            defender.addBuff(buff);
        }

        return true;
    }
}