import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 奥术光环，每[0]秒为所有友军回复[1]点魔法
 */
export class MagicRing extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.magicRing;
    }
    public get effName(): string {
        return "magicRing";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let deltaTime = data.skillEff.effArr[0];
        let mp = data.skillEff.effArr[1];
        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.recoverMpRange, [mp]);
        let effectData = new EffData(effInfo, data.defender);
        let buff = new ChessBuff(0, deltaTime, data.defender, effectData);
        data.defender.addBuff(buff);
        return true;
    }
}