import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, DamageType } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 撕裂，降低目标[0]点攻速，并造成每[1]秒[2]点伤害，持续[3]秒
 */
export class Tear extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.tear;
    }
    public get effName(): string {
        return "tear";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let attackSpeed = data.skillEff.effArr[0];
        let deltaTime = data.skillEff.effArr[1];
        let damage = data.skillEff.effArr[2];
        let lifeTime = data.skillEff.effArr[3];

        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.damage, [damage, DamageType.normal]);
        let effData = new EffData(effInfo, data.attacker, data.defender);
        let buff = new ChessBuff(lifeTime, deltaTime, data.defender, effData);
        buff.setAttrChange("attackSpeed", -attackSpeed);
        data.defender.addBuff(buff);
        return true;
    }
}