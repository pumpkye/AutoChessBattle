import { ChessNpc } from "./Model/ChessNpc";
import { attackRangeConfig, dirConfig, raceBuffConfig, careerBuffConfig } from "./Config/AutoBattleConfig";
import { ChessNpcInfo } from "./Input/InputCache";
import { WorsConfig } from "./Config/WordsConfig";

/**
 * 
 */
class Util {
    constructor() {

    }

    /**
     * 读取excell表数据
     * @param name 表名
     * @param id 主键id
     */
    getExcellData(name: string, id: number): any {
        return null;
    }

    /**
     * 读取xml配置
     * @param name xml文件名
     */
    getXmlData(name: string): any {

    }

    getDir(dirX: number, dirY: number): number {
        if (dirX != 0) {
            dirX = Math.floor(dirX / Math.abs(dirX));
        }
        if (dirY != 0) {
            dirY = Math.floor(dirY / Math.abs(dirY));
        }
        let dir = 0
        for (let i = 0; i < 8; i++) {
            if (dirConfig[i].x == dirX && dirConfig[i].y) {
                dir = i;
                break;
            }
        }
        return dir
    }

    getDistance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }

    getCityDistance(pos1X: number, pos1Y: number, pos2X: number, pos2Y: number): number;
    getCityDistance(npc1: ChessNpc, npc2: ChessNpc): number;
    getCityDistance(arg1: ChessNpc | number, arg2: ChessNpc | number, arg3?: number, arg4?: number): number {
        if (typeof arg1 === 'number' && typeof arg2 === 'number') {
            return Math.abs(arg1 - arg3) + Math.abs(arg2 - arg4);
        } else if (typeof arg1 === 'object' && typeof arg2 === 'object') {
            return Math.abs(arg1.posX - arg2.posX) + Math.abs(arg1.posY - arg2.posY);
        }
    }

    checkPosShortInRange(pos1X: number, pos1Y: number, pos2X: number, pos2Y: number, radius: number): boolean {
        let dx = Math.abs(pos1X - pos2X);
        if (dx > radius) {
            return false;
        }
        let dy = Math.abs(pos1Y - pos2Y);
        if (attackRangeConfig[radius] && dy > attackRangeConfig[radius][dx]) {
            return false;
        }
        return true;
    }

    /**
    * 返回一个[1,num]的随机数
    * @param num 
    */
    public getRandomNumber(num: number): number {
        if (num <= 1) {
            return num;
        }
        let rad = Math.floor(Math.random() * num) + 1;
        return rad;
    }

    /**
     * 获取阵容触发的职业和种族buff
     * @param baseIdList 阵容的baseId列表，可重复
     */
    getCareerAndRaceBuffList(npcInfoList: Array<ChessNpcInfo>): BuffArr {
        let npcList = new Array<ChessNpc>();
        for (let i = 0; i < npcInfoList.length; i++) {
            const info = npcInfoList[i];
            let chessNpc = new ChessNpc(info.thisId, info.baseId, info.level, true);
            npcList.push(chessNpc);
        }

        let careerArr = new Array<number>();
        let raceArr = new Array<number>();
        for (const key in careerBuffConfig) {
            if (careerBuffConfig.hasOwnProperty(key)) {
                const element = careerBuffConfig[key];
                let careerNum = 0;
                let tempList = new Array<number>();
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    if (npc.career == Number(key)) {
                        tempList[npc.baseId] = 1;
                    }
                }
                for (const baseId in tempList) {
                    if (tempList.hasOwnProperty(baseId)) {
                        careerNum += 1;
                        if (element[careerNum]) {
                            careerArr[Number(key)] = careerNum;
                        }
                    }
                }
            }
        }
        for (const key in raceBuffConfig) {
            if (raceBuffConfig.hasOwnProperty(key)) {
                let tempList = new Array<number>();
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    if (npc.race == Number(key)) {
                        tempList[npc.baseId] = 1;
                    }
                }
                const element = raceBuffConfig[key];
                let raceNum = 0;
                for (const baseId in tempList) {
                    if (tempList.hasOwnProperty(baseId)) {
                        raceNum += 1;
                        if (element[raceNum]) {
                            raceArr[Number(key)] = raceNum;
                        }
                    }
                }
            }
        }
        let buffArr: BuffArr = {
            careerArr,
            raceArr,
        }
        return buffArr;
    }

    /**
     * 获取触发的种族和职业buff描述字符串
     * @param npcInfoList 阵容的baseId列表，可重复
     */
    getCareerAndRaceBuffStr(npcInfoList: Array<ChessNpcInfo>): string {
        let str = "";
        let buffArr = this.getCareerAndRaceBuffList(npcInfoList);
        /**
         * 职业描述字符串
         */
        for (const careerId in buffArr.careerArr) {
            if (buffArr.careerArr.hasOwnProperty(careerId)) {
                const num = buffArr.careerArr[careerId];
                str = str + WorsConfig.career[Number(careerId)] + num.toString();
            }
        }
        /**
         * 种族描述字符串
         */
        for (const raceId in buffArr.raceArr) {
            if (buffArr.raceArr.hasOwnProperty(raceId)) {
                const num = buffArr.raceArr[raceId];
                str = str + WorsConfig.race[Number(raceId)] + num.toString();
            }
        }
        return str;
    }
}

export const g_Util = new Util();

export interface BuffArr {
    /**
     * key为职业Id,number为触发最高buff所需要的npc数量
     */
    careerArr: Array<number>;
    raceArr: Array<number>;
}