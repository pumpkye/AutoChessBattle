import { g_Util } from "../Util";
import { ChessNpc } from "./ChessNpc";
import { printDefault } from "../OutPut/Printer";
import { SkillEffectEnum } from "../SkillEffect/SkillEffectEnum";

/**
 * 技能的效果字段
 */
export class EffectInfo {
    private _effId = 0;
    private _effArr: Array<number>;
    constructor() { }

    /**
     * 使用效果字符串初始化
     * @param effStr 效果字段
     */
    initByStr(effStr: string) {
        let strs = effStr.split(",");
        this._effId = Number(strs[0]);
        this._effArr = new Array();
        for (let i = 1; i < strs.length; i++) {
            const e = Number(strs[i]);
            this._effArr.push(e);
        }
    }
    /**
     * 使用具体参数初始化
     * @param effId 
     * @param effArr 
     */
    init(effId: SkillEffectEnum, effArr?: Array<number>) {
        this._effId = effId;
        this.effArr = effArr;
    }
    /**
     * 技能效果Id
     */
    public get effId(): number {
        return this._effId;
    }

    /**
     * 效果字段
     */
    public set effArr(v: Array<number>) {
        this._effArr = v;
    }

    public get effArr(): Array<number> {
        return this._effArr;
    }
}

/**
 * 为skillEffect提供输入,包含effectInfo和attacker
 */
export class EffData {
    attacker: ChessNpc;
    defender: ChessNpc;
    skillEff: EffectInfo;
    race = 0;
    career = 0;
    constructor(skillEff: EffectInfo, attacker?: ChessNpc, defender?: ChessNpc) {
        this.skillEff = skillEff;
        this.attacker = attacker;
        this.defender = defender;
    }
}