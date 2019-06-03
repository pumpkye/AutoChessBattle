import { ChessNpc } from "./Model/ChessNpc";
import { raceBuffConfig, careerBuffConfig, dirConfig } from "./Config/AutoBattleConfig";
import { RaceSkill, CareerSkill } from "./Model/ChessSkill";
import { printErrMsg, pErrTag, printDefault, printBattleMsg, pTag, pBattleAction, printChessTable } from "./OutPut/Printer";
import { LayoutInfo } from "./Input/InputCache";
import { g_OutputCache } from "./OutPut/OutPutCache";

export enum Enum_Mode {
    normal = 1,
    quick,
    test
}

/**
 * 单局对战的管理器
 */
class AutoBattleManager {
    private _mode = 0;
    private _matchIdx = -1;
    private _randomSet: Array<number>;
    private _chessTable: Array<Array<ChessNpc>>;
    private _npcListA: Array<ChessNpc>;
    private _npcListB: Array<ChessNpc>;
    private _dpsInfo: Array<DpsInfo>;

    private _allMyNpcCount = 0;
    private _allEnemyNpcCount = 0;
    private _curTime = 0;
    private _deltaTime = 0;
    private _isStart = false;
    private _thisIdSeed = 0;

    constructor() {
        this._mode = Enum_Mode.test;
        this.clear()
    }

    /**
     * update
     */
    public update(dt: number): any {
        if (!this._isStart) {
            return
        }
        this._curTime += dt;
        let tempList = new Array<ChessNpc>();
        for (let i = 0; i < this._npcListA.length; i++) {
            const e = this._npcListA[i];
            if (!e.isDead) {
                tempList.push(e);
            }
        }
        for (let i = 0; i < this._npcListB.length; i++) {
            const e = this._npcListB[i];
            if (!e.isDead) {
                tempList.push(e);
            }
        }
        tempList.sort(function (a: ChessNpc, b: ChessNpc) {
            if (a.speed == b.speed) {
                return b.thisId - a.thisId;
            } else {
                return b.speed - a.speed;
            }
        });

        for (let i = 0; i < tempList.length; i++) {
            const e = tempList[i];
            if (!e.isDead) {
                e.update(dt);
            }
        }
        for (let i = 0; i < tempList.length; i++) {
            const e = tempList[i];
            if (!e.isDead) {
                e.attack();
            }
        }

        this._npcListA = this.removeDeath(this._npcListA);
        this._npcListB = this.removeDeath(this._npcListB);

        this.checkGameResult();

        this._deltaTime = this._deltaTime + dt;
        if (this._deltaTime > 1000) {
            this.printChessTable()
            this._deltaTime = this._deltaTime - 1000;
        }

        if (this._mode == Enum_Mode.quick || this._mode == Enum_Mode.test) {
            return this.update(50);
        }
    }

    checkGameResult() {
        if (this._curTime >= 60 * 1000) {
            this._isStart = false;
            console.log("Game finish when time over");
        } else if (this._npcListA.length == 0) {
            this._isStart = false;
            console.log("Game over!");
        } else if (this._npcListB.length == 0) {
            this._isStart = false;
            g_OutputCache.isWin = true;
            console.log("Win!");
        }
        if (!this._isStart) {
            this.printChessTable();
            console.log("Game total time:", this._curTime);
        }
    }
    removeDeath(npcList: Array<ChessNpc>): Array<ChessNpc> {
        let tempList = new Array<ChessNpc>();
        for (let i = 0; i < npcList.length; i++) {
            const e = npcList[i];
            if (e.isDead) {
                delete (this._chessTable[e.posX][e.posY]);
            } else {
                tempList.push(e);
            }
        }
        return tempList;
    }

    start(layoutA: LayoutInfo, layoutB: LayoutInfo, matchIdx: number) {
        if (!layoutA || !layoutB) {
            return;
        }
        g_OutputCache.isWin = false;
        this._matchIdx = matchIdx;
        printDefault("autobattleManager start");
        this.clear();
        // this._mode == Enum_Mode.test;
        this.init(layoutA, layoutB);

        this._curTime = 0;
        this.prepareBattle();
        this._isStart = true;
        if (this.mode == Enum_Mode.quick) {
            this.update(50);
        }
    }

    init(layoutA: LayoutInfo, layoutB: LayoutInfo) {
        printDefault('curMode' + this.mode);
        this.initNpcList(layoutA, layoutB);
        this.initChessTable();
    }

    /**
    * 初始化输入
    */
    initNpcList(layoutA: LayoutInfo, layoutB: LayoutInfo) {
        this._npcListA = new Array<ChessNpc>();
        this._npcListB = new Array<ChessNpc>();
        for (let i = 0; i < layoutA.npcList.length; i++) {
            const npc = layoutA.npcList[i];
            let chessNpc = new ChessNpc(npc.thisId, npc.baseId, npc.level, true);
            chessNpc.setPosition(npc.pos.x, npc.pos.y);
            this._npcListA.push(chessNpc);
        }
        for (let i = 0; i < layoutB.npcList.length; i++) {
            const npc = layoutB.npcList[i];
            let chessNpc = new ChessNpc(npc.thisId, npc.baseId, npc.level, false);
            chessNpc.setPosition(7 - npc.pos.x, 7 - npc.pos.y);
            this._npcListB.push(chessNpc);
        }
    }

    /**
     * 初始化棋盘
     */
    initChessTable() {
        this._chessTable = new Array<Array<ChessNpc>>();
        for (let i = 0; i < 8; i++) {
            this._chessTable[i] = new Array();
        }
        for (let i = 0; i < this._npcListA.length; i++) {
            const npc = this._npcListA[i];
            this._chessTable[npc.posX][npc.posY] = npc;
        }
        for (let i = 0; i < this._npcListB.length; i++) {
            const npc = this._npcListB[i];
            this._chessTable[npc.posX][npc.posY] = npc;
        }
        this.printChessTable();
    }

    /**
     * 添加种族buff、职业buff, npc技能初始化
     */
    prepareBattle() {
        printBattleMsg(pTag.battle, pBattleAction.prepare, "初始化我方种族buff");
        this.checkRaceBuff(this._npcListA);
        printBattleMsg(pTag.battle, pBattleAction.prepare, "初始化我方职业buff");
        this.checkCareerBuff(this._npcListA);
        printBattleMsg(pTag.battle, pBattleAction.prepare, "初始化敌方种族buff");
        this.checkRaceBuff(this._npcListB);
        printBattleMsg(pTag.battle, pBattleAction.prepare, "初始化敌方职业buff");
        this.checkCareerBuff(this._npcListB);

        for (let i = 0; i < this._npcListA.length; i++) {
            const npc = this._npcListA[i];
            npc.initSkillList();
        }

        for (let i = 0; i < this._npcListB.length; i++) {
            const npc = this._npcListB[i];
            npc.initSkillList();
        }
        this.printChessTable();
    }

    checkRaceBuff(npcList: Array<ChessNpc>) {
        for (const key in raceBuffConfig) {
            if (raceBuffConfig.hasOwnProperty(key)) {
                let tempList = new Array<ChessNpc>();
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    if (npc.race == Number(key)) {
                        tempList[npc.baseId] = npc;
                    }
                }
                const element = raceBuffConfig[key];
                let raceNum = 0;
                for (const baseId in tempList) {
                    if (tempList.hasOwnProperty(baseId)) {
                        const npc = tempList[baseId];
                        raceNum += 1;
                        if (element[raceNum]) {
                            printDefault("raceNum:" + raceNum);
                            // console.log("触发种族buff:", element[raceNum]);
                            let raceSkill = new RaceSkill(element[raceNum], Number(key), npc.isTeamA);
                            raceSkill.play();
                        }
                    }
                }
            }
        }
    }

    checkCareerBuff(npcList: Array<ChessNpc>) {
        for (const key in careerBuffConfig) {
            if (careerBuffConfig.hasOwnProperty(key)) {
                const element = careerBuffConfig[key];
                let careerNum = 0;
                let tempList = new Array<ChessNpc>();
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    if (npc.career == Number(key)) {
                        tempList[npc.baseId] = npc;
                    }
                }
                for (const baseId in tempList) {
                    if (tempList.hasOwnProperty(baseId)) {
                        const npc = tempList[baseId];
                        careerNum += 1;
                        if (element[careerNum]) {
                            // console.log("触发职业buff:", element[careerNum]);
                            let careerSkill = new CareerSkill(element[careerNum], Number(key), npc.isTeamA);
                            careerSkill.play();
                        }
                    }
                }
                for (let i = 0; i < tempList.length; i++) {

                }
            }
        }
    }

    /**
     * 返回一个[1,num]的随机数
     * @param num 
     */
    public getRandomNumber(num: number): number {
        if (this._mode == Enum_Mode.quick || this._mode == Enum_Mode.test) {
            let rad = Math.floor(Math.random() * num) + 1;
            this._randomSet.push(rad);
            return rad;
        } else {
            let rad = this._randomSet.shift();
            if (!rad || rad > num) {
                if (!rad) {
                    printErrMsg(pErrTag.randomNum, { max: num, rad: "null" });
                    // console.log("no enough random number");
                } else {
                    printErrMsg(pErrTag.randomNum, { max: num, rad: rad });
                    // console.log("get error random number")
                }
                console.log("no enough random num");
                rad = Math.floor(Math.random() * num) + 1;
            }
        }
        return 0;
    }

    /**
     * 添加dps记录
     */
    public addDpsInfo(thisId: number, baseId: number, isTeamA: boolean, dps: number) {
        if (this._dpsInfo[thisId]) {
            let dpsInfo = this._dpsInfo[thisId];
            dpsInfo.addDps(dps, this.curTime);
        } else {
            let dpsInfo = new DpsInfo(this.matchIdx, thisId, baseId, isTeamA);
            dpsInfo.addDps(dps, this.curTime);
            this._dpsInfo[thisId] = dpsInfo;
        }
    }

    public getDpsInfo(thisId: number) {
        return this._dpsInfo[thisId];
    }

    public set mode(v: number) {
        this._mode = v;
    }

    public get mode(): number {
        return this._mode;
    }

    public get chessTable(): Array<Array<ChessNpc>> {
        return this._chessTable;
    }

    public get curTime(): number {
        return this._curTime;
    }

    public get matchIdx(): number {
        return this._matchIdx;
    }

    public get npcListA(): Array<ChessNpc> {
        return this._npcListA;
    }

    public get npcListB(): Array<ChessNpc> {
        return this._npcListB;
    }

    public getFriendList(chessNpc: ChessNpc): Array<ChessNpc> {
        if (chessNpc && !chessNpc.isTeamA) {
            return this._npcListB;
        }
        return this._npcListA;
    }

    public getEnemyList(chessNpc: ChessNpc): Array<ChessNpc> {
        if (chessNpc && !chessNpc.isTeamA) {
            return this._npcListA;
        }
        return this._npcListB;
    }

    public getChessNpc(posX: number, posY: number) {
        if (this.chessTable && this.chessTable[posX] && this.chessTable[posX][posY]) {
            return this.chessTable[posX][posY]
        }
    }

    public getChessNpcByThisId(thisId: number) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let chessNpc = this.chessTable[i][j];
                if (chessNpc && chessNpc.thisId == thisId) {
                    return chessNpc
                }
            }

        }
    }

    public getNearBlankPosition(center: { x: number, y: number }): { x: number, y: number } {
        let chessTable = this.chessTable;
        for (let i = 1; i < 9; i++) {
            for (let dir = 0; dir < 8; dir++) {
                let dirT = dirConfig[dir];
                let x = center.x + dirT.x * i;
                let y = center.y + dirT.y * i;
                if (this.isInChessTable(x, y) && !chessTable[x][y]) {
                    return { x, y };
                }
            }

        }
    }

    public isInChessTable(x: number, y: number) {
        return (x >= 0 && x < 8 && y >= 0 && y < 8);
    }

    /**
     * 约定：生成的thisId>100000,若有服务器生成的thisId，注意一下这里不要冲突
     */
    public generateThisId() {
        this._thisIdSeed = this._thisIdSeed + 1;
        return 100000 + this._thisIdSeed;
    }
    /**
     * clear
     */
    public clear() {
        printDefault("auto BattleManager clear");
        this._npcListA = null;
        this._npcListB = null;
        this._chessTable = null;

        this._isStart = false;
        this._curTime = 0;
        this._deltaTime = 0;
        this._allEnemyNpcCount = 0;
        this._allMyNpcCount = 0;
        this._thisIdSeed = 0;
        this._randomSet = new Array<number>();
        this._dpsInfo = new Array();
    }


    /**
     * 打印棋盘
     */
    public printChessTable() {
        let str = "curTime:" + this.curTime + "=======================================\n";
        for (let i = -1; i < 8; i++) {
            str += (i + 1) + "\t\t";
        }
        str += "\n";
        for (let j = 0; j < 8; j++) {
            let s = (j + 1) + "\t\t";
            for (let i = -1; i < 8; i++) {
                if (this.chessTable[i] && this.chessTable[i][j]) {
                    let npc = this.chessTable[i][j];
                    if (!npc.isDead) {
                        s = `${s}${npc.printName}`;
                    } else {
                        s = s + "\t";
                    }
                } else {
                    s = s + "\t";
                }
                s = s + "\t";
            }
            str = str + s + "\n";
        }
        str = str + "==================================================================\n";
        printChessTable(str);
        // console.log(str);
    }
}

export var g_AutoBattleManager = new AutoBattleManager()

class DpsInfo {
    matchIdx = 0;
    thisId: number;
    baseId: number;
    isTeamA = false;
    dps: number;
    time: number;
    constructor(matchIdx: number, thisId: number, baseId: number, isTeamA: boolean) {
        this.matchIdx = matchIdx;
        this.thisId = thisId;
        this.baseId = baseId;
        this.isTeamA = isTeamA;
        this.dps = 0;
        this.time = 0;
    }

    addDps(dps: number, time: number) {
        this.dps = this.dps + dps;
        this.time = time;
    }
}