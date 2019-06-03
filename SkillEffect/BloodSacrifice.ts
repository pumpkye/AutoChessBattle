import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, BuffAndDotState } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 对当前目标造成最大生命值[0]%的伤害，同时对自己造成最大生命值[1]%的伤害，并获得一个buff:触发暴击时恢复伤害[2]%的血量，持续时间[3]秒
 */
export class BloodSacrifice extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.bloodSacrifice;
    }
    public get effName(): string {
        return "bloodSacrifice";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.attacker || data.attacker.isDead || !data.defender || data.defender.isDead) {
            return false;
        }

        let damagePer = data.skillEff.effArr[0];
        let hurtSelfPer = data.skillEff.effArr[1];
        let recoverPer = data.skillEff.effArr[2];
        let lifeTime = data.skillEff.effArr[3];

        let damage = Math.floor(data.defender.hp * damagePer / 100);
        let hurtSelf = Math.floor(data.attacker.hp * hurtSelfPer / 100);
        // let hurtSelf = Math.floor(damage * hurtSelfPer / 100);        
        data.defender.reduceHp(damage);
        data.attacker.reduceHp(hurtSelf);

        let buff = new ChessBuff(lifeTime, 0, data.attacker, null, BuffAndDotState.bkb);
        buff.setAttrChange("bloodSacrifice", recoverPer);
        data.attacker.addBuff(buff);
        return true;
    }
}