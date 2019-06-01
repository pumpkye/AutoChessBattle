import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, DamageType } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { damageK } from "../Config/AutoBattleConfig";
import { printDefault, printBattleMsg, pTag, pBattleAction } from "../OutPut/Printer";
import { g_AutoBattleManager } from "../AutoBattleManager";

/**
 * 对目标造成[0]点[1{1：普通，2：魔法，3：纯粹}]类型伤害
 */
export class Damage extends BaseSkillEffect {
    constructor() {
        super();
    }

    public get effectId(): number {
        return SkillEffectEnum.damage;
    }

    public get effName(): string {
        return "point damage";
    }

    /**
     * play
     */
    public play(data: EffData): number {
        let attacker = data.attacker;
        let defender = data.defender;
        if (!attacker || !defender || defender.isDead) {
            return;
        }
        let rDamage = 0;
        let skillEff = data.skillEff;
        let damage = skillEff.effArr[0];
        let damageType = skillEff.effArr[1];
        switch (damageType) {
            case DamageType.normal:
                let flag = 1;
                if (defender.defence < 0) {
                    flag = -1;
                }
                let defence = Math.abs(defender.defence);
                let per = 1 - flag * damageK.k1 * defence / (damageK.k2 + damageK.k3 * defence)
                rDamage = damage * per;
                break;
            case DamageType.magic:
                rDamage = damage * (100 - defender.mDefence) / 100.0;
                break;
            case DamageType.real:
                rDamage = damage;
            default:
                break;
        }
        //判定战吼减伤
        let warCryInfo = defender.getAttrChange("warCry");
        if (warCryInfo && warCryInfo.length > 0) {
            let rp = 1;
            for (let i = 0; i < warCryInfo.length; i++) {
                const per = warCryInfo[i].info;
                rp = rp * (100 - per) / 100;
            }
            printBattleMsg(pTag.battle, pBattleAction.warCry, { npc: defender, per: rp });
            rDamage = rDamage * rp;
        }
        rDamage = Math.floor(rDamage);
        //被放逐的目标不受物理伤害但是受到额外的魔法伤害
        let banishInfo = defender.getAttrChange("banish");
        if (banishInfo && banishInfo.length > 0) {
            if (damageType == DamageType.normal) {
                rDamage = 0;
            } else if (damageType == DamageType.magic) {
                let per = banishInfo[0].info
                rDamage = rDamage * per / 100;
            }
        }
        //护盾减伤
        if (rDamage > 0) {
            let missDamageInfo = defender.getShieldState("MissDamageShield");
            if (missDamageInfo && missDamageInfo.length > 0) {
                let arg = { damage: rDamage };
                missDamageInfo[0].doShieldEffect(arg);
                rDamage = arg.damage;
            }
        }

        //伤害回蓝
        defender.mp = defender.mp + Math.floor(rDamage / 10);
        if (attacker && !attacker.isDead) {
            attacker.mp = attacker.mp + Math.floor(rDamage / 10);
        }
        //dps统计
        g_AutoBattleManager.addDpsInfo(attacker.thisId, attacker.baseId, attacker.isTeamA, rDamage);
        //造成伤害
        printBattleMsg(pTag.battle, pBattleAction.damage, { attacker: attacker, defender: defender, damage: rDamage });
        defender.reduceHp(rDamage);
        // defender.hp = defender.hp - rDamage;
        if (defender.hp <= 0) {
            defender.die();
        }

        return rDamage;
    }
}
