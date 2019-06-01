import { ChessNpc } from "./ChessNpc";
import { EffData } from "./EffectInfo";
import { BuffAndDotState, DebuffState } from "../SkillEffect/SkillEffectEnum";
import { skillEffects } from "../SkillEffect/InitSkillEffect";
import { printBattleMsg, pTag, pBattleAction, printDefault } from "../OutPut/Printer";
/**
 * 
 */
export class ChessBuff {
    private _lifeTime = 0;
    private _deltaTime = 0;
    protected _chessNpc: ChessNpc;
    private _effData: EffData;
    private _stateId: BuffAndDotState;
    private _dt = 0;
    private _isTriggerOnce = false;   // 是否只触发一次效果
    private _isForever = false; //永久被动

    private attrChange: { [index: string]: AttrChangeInfo };

    /**
     * 
     * @param lifeTime 持续时间，0的时候表示永久有效
     * @param deltaTime 生效间隔，0的时候表示只生效一次
     * @param chessNpc 添加目标
     * @param effData 
     * @param stateId 
     */
    constructor(lifeTime: number, deltaTime: number, chessNpc: ChessNpc, effData?: EffData, stateId?: BuffAndDotState) {
        this._lifeTime = lifeTime;
        this._deltaTime = deltaTime;
        if (this._deltaTime == 0) {
            this._isTriggerOnce = true;
        }
        if (lifeTime == 0) {
            this._isForever = true;
        }
        this._chessNpc = chessNpc;
        this._effData = effData;
        if (stateId) {
            this._stateId = stateId;
            chessNpc.addBuffState(stateId);
            /**
             * 韧性降低负面效果
             */
            if (DebuffState[stateId]) {
                let rd = chessNpc.getAttrChange("reduceDebuffTime")
                if (rd && rd.length > 0) {
                    for (let i = 0; i < rd.length; i++) {
                        const per = rd[i].info;
                        lifeTime = lifeTime * (100 - per) / 100;
                    }
                }
                this._lifeTime = lifeTime;
            }
            printBattleMsg(pTag.battle, pBattleAction.addDebuff, { time: this._lifeTime });
        }
        this.update(0);
    }

    update(dt: number) {
        if (this._lifeTime > 0 && !this._isForever) {
            this._lifeTime = this._lifeTime - dt;
            if (this._lifeTime <= 0) {
                this.destroy()
            }
        }
        if (!this._isTriggerOnce) {
            this._dt = this._dt - dt;
            if (this._dt <= 0) {
                this.doBuffEffect()
                this._dt = this._deltaTime + this._dt;
            }
        }
    }

    doBuffEffect() {
        if (this._effData) {
            let effId = this._effData.skillEff.effId;
            skillEffects[effId].play(this._effData);
        }
    }

    /**
     * buff销毁时的操作
     */
    destroy() {
        if (this._stateId) {
            this._chessNpc.removeBuffState(this._stateId);
        }
        if (this.attrChange && this._chessNpc) {
            for (const key in this.attrChange) {
                if (this.attrChange.hasOwnProperty(key)) {
                    const attrChange = this.attrChange[key];
                    this._chessNpc.removeAttrChange(key, attrChange.idx);
                }
            }
        }
    }

    setAttrChange(attrName: string, value: any) {
        if (this._chessNpc) {
            let attrChangeInfo = new AttrChangeInfo(value);
            this._chessNpc.addAttrChange(attrName, attrChangeInfo);
            if (!this.attrChange) {
                this.attrChange = {};
            }
            this.attrChange[attrName] = attrChangeInfo;
        }
    }

    getAttrChange(attrName: string) {
        if (this.attrChange) {
            return this.attrChange[attrName];
        }
        return null;
    }

    get isValid() {
        return this._lifeTime > 0 || this._isForever;
    }

    checkIsValid() {
        return this._lifeTime > 0 || this._isForever;
    }
}

export class AttrChangeInfo {
    idx: number;
    info: any;
    constructor(info: any) {
        this.idx = 0;
        this.info = info;
    }
}

/**
 * 护盾的实现机制不是很理想，欢迎重构这部分代码或提供意见
 */
export class ChessShield extends ChessBuff {
    private _lifeCount = 0;
    protected shieldData: any;
    idx = 0;
    name = "ChessShield";

    constructor(lifeTime: number, lifeCount: number, chessNpc: ChessNpc, shieldData: any) {
        super(lifeTime, 0, chessNpc);
        this._lifeCount = lifeCount;
        this.shieldData = shieldData;
    }

    /**
     * 执行护盾过程
     * @param arg 一个对象，既是传入值，也传出结果
     * @returns 返回值返回该次处理是否成功，如果护盾已失效，则返回false
     */
    doShieldEffect(arg: object) {
        this._lifeCount = this._lifeCount - 1;
        return this._lifeCount >= 0;
    }

    update(dt: number) {
        super.update(dt);
        if (this._lifeCount <= 0) {
            this.destroy();
        }
    }

    destroy() {
        super.destroy();
        this._chessNpc.removeShield(this);
    }

    get isValid() {
        return super.checkIsValid() && this._lifeCount > 0;
    }
}

export class AddDamageShield extends ChessShield {
    name = "AddDamageShield";
    doShieldEffect(arg: { damage: number }) {
        if (!super.doShieldEffect(null)) {
            return false;
        }
        arg.damage = arg.damage + this.shieldData;
        return true;
    }
}

export class MissDamageShield extends ChessShield {
    name = "MissDamageShield";
    doShieldEffect(arg: { damage: number }) {
        if (!super.doShieldEffect(null)) {
            return false;
        }
        arg.damage = 0;
        printBattleMsg(pTag.battle, pBattleAction.missDamage);
        return true;
    }
}
