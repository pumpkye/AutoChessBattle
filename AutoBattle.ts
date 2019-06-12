import { g_InputCache } from "./Input/InputCache";
import { printErrMsg, pErrTag, printDefault } from "./OutPut/Printer";
import { testInputStr } from "./Input/TestInput";
import { g_AutoBattleManager, Enum_Mode } from "./AutoBattleManager";
import { ChessNpcBaseData } from "./TbxModel/ChessNpcBaseData";

/**
 * autoBattle 入口
 */
class AutoBattle {
    constructor() {

    }

    init() {

    }

    loadConfig() {

    }

    /**
     * 自走棋战斗
     */
    doAutoBattle(mode?: Enum_Mode) {
        let battleInfo = g_InputCache.getBattleInfo()
        if (!battleInfo) {
            printErrMsg(pErrTag.inputNull);
            return false;
        }
        g_AutoBattleManager.mode = Enum_Mode.quick;
        if (mode) {
            g_AutoBattleManager.mode = mode;
        }
        printDefault(battleInfo);
        for (let i = 0; i < battleInfo.matches.length; i++) {
            let match = battleInfo.matches[i];
            let layoutA = battleInfo.getLayoutByPlayerId(match.playerThisIdA);
            let layoutB = battleInfo.getLayoutByPlayerId(match.playerThisIdB);
            if (layoutA && layoutB) {
                g_AutoBattleManager.start(layoutA, layoutB, i);
            }
        }
    }

    test() {
        g_InputCache.loadBattleInfoFromJson(testInputStr);
        this.doAutoBattle();
        //load testInput
        //
    }

    checkInput() {

    }

    /**
     * 获取ChessNpc的基础数据
     * @param baseId 
     */
    getNpcDataByBaseId(baseId: number) {
        let baseData = new ChessNpcBaseData(baseId);
    }
}

/**
 * 提供外部调用AutoBattle的接口
 */
export const g_AutoBattle = new AutoBattle()

