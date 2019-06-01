import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { ChessNpc } from "../Model/ChessNpc";
import { printBattleMsg, pTag, pBattleAction } from "../OutPut/Printer";
/**
 * 为所有友军回复[0]点魔法
 */
export class RecoverMpRange extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.recoverMpRange;
    }
    public get effName(): string {
        return "recoverMpRange";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let mp = data.skillEff.effArr[0]
        let hitNpc = g_AutoBattleManager.getFriendList(data.attacker);
        for (let i = 0; i < hitNpc.length; i++) {
            const npc = hitNpc[i];
            printBattleMsg(pTag.battle, pBattleAction.recoverMp, { npc: npc, mp: mp });
            npc.mp = npc.mp + mp;
        }
        return true;
    }
}