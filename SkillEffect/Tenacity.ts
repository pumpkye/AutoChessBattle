import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 增加状态抗性[0]%,增加回血每[1]秒[2]点
 */
export class Tenacity extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.tenacity;
    }
    public get effName(): string {
        return "tenacity";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let rhp = data.skillEff.effArr[2];
        let rhpt = data.skillEff.effArr[1];
        let reduceDebuffPer = data.skillEff.effArr[0];
        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.recoverHp, [rhp]);
        let effData = new EffData(effInfo, data.attacker, data.defender);
        let buff = new ChessBuff(0, rhpt, data.defender, effData);
        buff.setAttrChange("reduceDebuffTime", reduceDebuffPer);
        data.defender.addBuff(buff);
        return true;
    }
}