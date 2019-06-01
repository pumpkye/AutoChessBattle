import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, BuffAndDotState } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { ChessBuff } from "../Model/ChessBuff";

/**
 * 旋风斩，以自己为中心，[0]范围内，每[1]秒造成[2]点伤害，持续[3]秒，期间自己无法攻击
 */
export class SwordStorm extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.swordStorm;
    }

    public get effName(): string {
        return "swordStorm";
    }

    play(data: EffData) {
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let skillEff = data.skillEff;
        let range = skillEff.effArr[0];
        let deltaTime = skillEff.effArr[1];
        let damage = skillEff.effArr[2];
        let lifeTime = skillEff.effArr[3];

        //持续造成伤害，持续期间无法普攻
        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.circleDamage, [range, 100, damage]);
        let effData = new EffData(effInfo, defender, defender);
        let chessBuff = new ChessBuff(lifeTime, deltaTime, defender, effData, BuffAndDotState.beDisarm);
        defender.addBuff(chessBuff);
        //持续期间魔免
        chessBuff = new ChessBuff(lifeTime, 0, defender, null, BuffAndDotState.bkb);
        defender.addBuff(chessBuff);
        return true;
    }
}