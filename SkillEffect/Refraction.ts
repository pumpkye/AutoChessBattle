import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../model/EffectInfo";
import { AddDamageShield, MissDamageShield } from "../Model/ChessBuff";
/**
 * 折光，接下来的[0]次攻击增加[1]点伤害，并免疫接下来的[2]次攻击,持续[3]秒
 */
export class Refraction extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.refraction;
    }
    public get effName(): string {
        return "refraction";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let defender = data.defender;
        if (!defender || defender.isDead) {
            return false;
        }
        let skillEff = data.skillEff.effArr;
        let aTime = skillEff[0];
        let damage = skillEff[1];
        let mTime = skillEff[2];
        let lifeTime = skillEff[3];
        let shield = new AddDamageShield(lifeTime, aTime, defender, damage);
        defender.addShield(shield);
        shield = new MissDamageShield(lifeTime, mTime, defender, null);

        defender.addShield(shield);
        return true;
    }
}