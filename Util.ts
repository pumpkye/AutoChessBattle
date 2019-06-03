import { ChessNpc } from "./Model/ChessNpc";
import { attackRangeConfig, dirConfig } from "./Config/AutoBattleConfig";

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
}

export var g_Util = new Util()