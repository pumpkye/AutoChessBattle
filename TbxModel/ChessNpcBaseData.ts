import { npc_data } from "../Tbx/npc_data";
/**
 * @author pumpkye
 */
export class ChessNpcBaseData {
    [index: string]: any;
    baseId = 0;
    name = "";
    hp = 0;
    maxHp = 0;
    mp = 0;
    maxMp = 0;
    damage = 0;
    defence = 0;
    mdefence = 0;
    attaSpeed = 0;
    attackRange = 0;
    skill = 0;
    normalSkill = 0;
    speed = 0;
    mvSpeed = 0;
    race = 0;
    career = 0;
    mvStep = 0;
    type = 0;
    quality = 0;
    /**
     * @description 通过baseId从配置文件中读取数据
     * @param baseId 
     */
    constructor(baseId: number) {
        this.baseId = baseId;
        let tbxData = npc_data[baseId];
        if (tbxData) {
            for (const key in tbxData) {
                if (tbxData.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                    this[key] = tbxData[key];
                }
            }

        }
    }


}
