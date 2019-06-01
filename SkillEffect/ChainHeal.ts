import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { ChessNpc } from "../Model/ChessNpc";
import { printBattleMsg, pTag, pBattleAction, printDefault } from "../OutPut/Printer";
/**
 * 对己方[0]个血量最低的单位回复[1]%的血量
 */
export class ChainHeal extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.chainHeal;
    }
    public get effName(): string {
        return "chainHeal";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let attacker = data.attacker;
        if (!attacker || attacker.isDead) {
            return false;
        }
        let count = data.skillEff.effArr[0];
        let recoverPercent = data.skillEff.effArr[1];

        let npcList = g_AutoBattleManager.getFriendList(attacker);
        let hitNpc = new Array<ChessNpc>();
        for (let i = 0; i < npcList.length; i++) {
            const npc = npcList[i];
            if (npc.hp / npc.maxHp < 1) {
                hitNpc.push(npc);
            }
        }
        hitNpc.sort((a: ChessNpc, b: ChessNpc) => {
            let perA = a.hp / a.maxHp;
            let perB = b.hp / b.maxHp;
            return perA - perB;
        })
        count = Math.min(count, hitNpc.length);
        for (let i = 0; i < count; i++) {
            let defender = hitNpc[i];
            let hpRecover = Math.floor(defender.maxHp * recoverPercent / 100);
            printBattleMsg(pTag.battle, pBattleAction.recoverHp, { attacker: attacker, defender: defender, hp: hpRecover });
            defender.reduceHp(-hpRecover);
        }
        return true;
    }
}