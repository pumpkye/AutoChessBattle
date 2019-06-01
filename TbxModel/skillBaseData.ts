import { skill_data } from "../Tbx/skill_data";

/**
 * @author  pumpkye
 * @des     技能配置数据的原型
 */
export class SkillBaseData {
    [index: string]: any;
    baseId = 0;
    name = "";
    gcd = 0;
    type = 0;
    targetType = 0;
    des = "";

    /**
     * @description 通过baseId从配置文件中读取数据
     * @param baseId 
     */
    constructor(baseId: number) {
        this.baseId = baseId;
        let tbxData = skill_data[baseId];
        if (tbxData) {
            for (const key in tbxData) {
                if (tbxData.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                    this[key] = tbxData[key];
                }
            }

        }
    }
}
