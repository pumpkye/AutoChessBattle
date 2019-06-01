import { skill_level_data } from "../Tbx/skill_level_data";

/**
 * @author pumpkye
 * @des 技能等级相关数据
 */
export class skillLevelData {
    [index: string]: any;
    id = 0;
    level = 0;
    cd = 0;
    mp = 0;
    range = 0;
    status = "";
    constructor(id: number) {
        this.id = id;
        let tbxData = skill_level_data[id];
        if (tbxData) {
            for (const key in tbxData) {
                if (tbxData.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                    this[key] = tbxData[key];
                }
            }

        }
    }


}