import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { AttrChangeInfo } from "../Model/ChessBuff";
/**
 * 嗜血之矛,每次攻击时消耗自身[0]点生命值，对目标造成每秒[1]点纯粹伤害，持续[2]秒，该伤害可以叠加，该伤害生效时会为自己恢复生命值
 */
export class BloodthirstySpear extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.bloodthirstySpear;
    }
    public get effName(): string {
        return "bloodthirstySpear";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return;
        }
        let hpReduce = data.skillEff.effArr[0];
        let damage = data.skillEff.effArr[1];
        let lifeTime = data.skillEff.effArr[2];

        data.defender.addAttrChange("bloodthirstySpear", new AttrChangeInfo({ hpReduce: hpReduce, damage: damage, lifeTime: lifeTime }));
        return true;
    }
}