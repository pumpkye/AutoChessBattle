import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { ChessPet } from "../Model/ChessNpc";
/**
 * 召唤npcId为[0]的npc，召唤[1]个
 */
export class Summon extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.summon;
    }
    public get effName(): string {
        return "summon";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.attacker || data.attacker.isDead) {
            return false;
        }

        let npcBaseId = data.skillEff.effArr[0];
        let count = data.skillEff.effArr[1];

        let npcList = g_AutoBattleManager.getFriendList(data.attacker);
        let chessTable = g_AutoBattleManager.chessTable;
        for (let i = 0; i < count; i++) {
            let pos = g_AutoBattleManager.getNearBlankPosition(data.attacker.getPosition());
            if (pos) {
                let pet = new ChessPet(g_AutoBattleManager.generateThisId(), npcBaseId, data.attacker.level, data.attacker.isTeamA, data.attacker.thisId);
                pet.setPosition(pos.x, pos.y);
                pet.initSkillList();
                npcList.push(pet);
                chessTable[pos.x][pos.y] = pet;
            }
        }


        return true;
    }

}