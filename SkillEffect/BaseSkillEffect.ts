import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { ChessNpc } from "../Model/ChessNpc";
import { g_Util } from "../Util";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { printBattleMsg, printErrMsg, pErrTag, pTag, pBattleAction } from "../OutPut/Printer";

export class BaseSkillEffect {
    constructor() {
        console.log("init skillEffect:", this.effName);
    }

    public get effectId(): number {
        return SkillEffectEnum.baseEffect;
    }

    public get effName(): string {
        return "BaseSkillEffect";
    }

    getRandomNpc(npcList: Array<ChessNpc>, count: number, range?: number, center?: { x: number, y: number }) {
        let tempList = new Array<ChessNpc>();
        let hitList = new Array<ChessNpc>();
        for (let i = 0; i < npcList.length; i++) {
            const npc = npcList[i];
            if ((!range || !center) || (range && center && g_Util.checkPosShortInRange(center.x, center.y, npc.posX, npc.posY, range))) {
                tempList.push(npc);
            }
        }
        if (count >= tempList.length) {
            return tempList;
        }
        for (let i = 0; i < count; i++) {
            let rad = g_AutoBattleManager.getRandomNumber(tempList.length) - 1;
            if (tempList[rad]) {
                hitList.push(tempList[rad]);
            } else {
                printErrMsg(pErrTag.randomNum, { max: tempList.length, rad: rad });
            }
        }
        return hitList;
    }

    /**
     * play
     */
    public play(data: EffData): any {
        printBattleMsg(pTag.battle, pBattleAction.doSkillEffect, this.effName);
        return true;
    }
}

