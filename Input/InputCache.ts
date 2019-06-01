import { testInputStr } from "./TestInput";
import { printDefault } from "../OutPut/Printer";

/**
 * 为autobattleManager提供输入源，autoBattleManager从这里读取对局阵容
 * 提供工具函数从不同输入添加输入信息
 */
class InPutCache {
    battleInfo: BattleInfo;
    constructor() {

    }

    /**
     * 通过BattleInfo对象设置battleInfo
     * @param battleInfo 一回合的所有对战信息
     */
    setBattleInfo(battleInfo: BattleInfo) {
        this.battleInfo = battleInfo;
    }

    /**
     * 从json读取数据
     * @param jsonStr json字符串
     */
    loadBattleInfoFromJson(jsonStr: string) {
        let jsonObj = JSON.parse(jsonStr);
        this.battleInfo = new BattleInfo(jsonObj.roundIndex);
        for (let i = 0; i < jsonObj.matches.length; i++) {
            const match = jsonObj.matches[i];
            this.battleInfo.addMatch(match.a, match.b);
        }
        for (let i = 0; i < jsonObj.allLayout.length; i++) {
            const layout = jsonObj.allLayout[i];
            let layoutInfo = new LayoutInfo(layout.playerId);
            for (let j = 0; j < layout.npcList.length; j++) {
                const npc = layout.npcList[j];
                layoutInfo.addChessNpcInfo(npc.thisId, npc.baseId, npc.level, { x: npc.posX, y: npc.posY });
            }
            this.battleInfo.addLayout(layoutInfo);
        }
    }

    /**
     * test success@4.17.2019
     */
    testLoadJson() {
        this.loadBattleInfoFromJson(testInputStr);
        console.log(this.battleInfo);
    }

    getBattleInfo() {
        return this.battleInfo;
    }

    clear() {
        this.battleInfo = null;
    }
}

export var g_InputCache = new InPutCache()

/**
 * 单回合所有对局信息
 */
export class BattleInfo {
    roundIndex: number;
    matches: Array<MatchInfo>;
    allLayout: Array<LayoutInfo>;
    constructor(roundIndex: number) {
        this.roundIndex = roundIndex;
        this.matches = new Array<MatchInfo>();
        this.allLayout = new Array<LayoutInfo>();
    }
    clear() {
        this.matches = new Array<MatchInfo>();
        this.allLayout = new Array<LayoutInfo>();
    }
    addMatch(playerThisIdA: number, playerThisIdB: number) {
        this.matches.push(new MatchInfo(playerThisIdA, playerThisIdB));
    }

    addLayout(layout: LayoutInfo) {
        this.allLayout.push(layout);
    }

    clearLayout() {
        this.allLayout = new Array<LayoutInfo>();
    }

    getLayoutByPlayerId(playerId: number): LayoutInfo {
        for (let i = 0; i < this.allLayout.length; i++) {
            const layout = this.allLayout[i];
            if (layout.playerThisId === playerId) {
                return layout;
            }
        }
        return null;
    }
}

/**
 * 对局信息
 */
class MatchInfo {
    playerThisIdA: number;
    playerThisIdB: number;

    constructor(playerThisIdA: number, playerThisIdB: number) {
        this.playerThisIdA = playerThisIdA;
        this.playerThisIdB = playerThisIdB;
    }
}

/**
 * 玩家布局信息
 */
export class LayoutInfo {
    playerThisId: number;
    npcList: Array<ChessNpcInfo>;
    constructor(thisId: number) {
        this.playerThisId = thisId;
        this.npcList = new Array<ChessNpcInfo>();
    }
    addChessNpcInfo(info: ChessNpcInfo): any;
    addChessNpcInfo(thisId: number, baseId: number, level: number, pos: { x: number, y: number }): any;
    addChessNpcInfo(arg1: number | ChessNpcInfo, baseId?: number, level?: number, pos?: { x: number, y: number }) {
        if (typeof (arg1) === "number") {
            this.npcList.push(new ChessNpcInfo(arg1, baseId, level, pos))
        } else {
            this.npcList.push(arg1);
        }
    }
}

/**
 * 单个npc的位置信息
 */
export class ChessNpcInfo {
    thisId: number;
    baseId: number;
    level: number;
    pos: {
        x: number,
        y: number,
    }

    constructor(thisId: number, baseId: number, level: number, pos: { x: number, y: number }) {
        this.thisId = thisId;
        this.baseId = baseId;
        this.level = level;
        this.pos = pos;
    }
}