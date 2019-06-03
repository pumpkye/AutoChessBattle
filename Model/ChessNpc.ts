import { ChessNpcBaseData } from "../TbxModel/ChessNpcBaseData";
import { ChessBuff, AttrChangeInfo, ChessShield } from "./ChessBuff";
import { ChessSkill, NormalSkill } from "./ChessSkill";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { g_Util } from "../Util";
import { CareerEnum } from "../Config/AutoBattleConfig";
import { printBattleMsg, pBattleAction, pTag, printDefault } from "../OutPut/Printer";
import { BuffAndDotState, SkillEffectEnum, DamageType } from "../SkillEffect/SkillEffectEnum";
import { EffectInfo, EffData } from "./EffectInfo";
import { skillEffects } from "../SkillEffect/InitSkillEffect";
/**
 * @author pumpkye
 * @description 棋子
 */
export class ChessNpc {
    readonly thisId: number;
    readonly baseId: number;
    teamA: boolean;
    curTarget: ChessNpc;
    curTargetThisId: number;
    public hitArrThisId: Array<number>; //攻击该npc的npc列表

    protected _lockTime = 0;
    dir = 0;
    protected _pos = {
        x: 0,
        y: 0,
    }

    readonly baseData: ChessNpcBaseData;
    protected _skillList: Array<ChessSkill>;
    protected _buffArr: Array<ChessBuff>;
    protected _buffStateArr: Array<number>;
    // protected _attrChangeMap: Map<string, Array<AttrChangeInfo>>;
    protected _attrChangeMap: { [index: string]: Array<AttrChangeInfo> };
    protected _shieldMap: { [index: string]: Array<ChessShield> };
    protected _isDead = false;

    // 数值数据
    protected _hp = 0;
    protected _maxHp = 0;
    protected _mp = 0;
    protected _maxMp = 0;
    protected _damage = 0;
    protected _defence = 0;
    protected _mDefence = 0;
    protected _attSpeed = 0;
    protected _attRange = 0;
    protected _speed = 0;
    protected _mvSpeed = 0;
    protected _level = 1;
    protected _moveStep = 0;

    constructor(thisId: number, baseId: number, level: number, teamA: boolean) {
        this.thisId = thisId;
        this.baseId = baseId;
        this.teamA = teamA;
        this.baseData = new ChessNpcBaseData(baseId);
        this._level = level;
        //初始化数值
        this._hp = this.baseHp;
        this._maxHp = this.baseHp;
        this._mp = 0;
        this._maxMp = this.baseMp;
        this._damage = this.baseDamage;
        this._defence = this.baseDefence;
        this._mDefence = this.baseMDefence;
        this._attSpeed = this.baseAttSpeed;
        this._attRange = this.baseAttRange;
        this._speed = this.baseSpeed;
        this._mvSpeed = this.baseMvSpeed;

        this._buffArr = new Array();
        this._buffStateArr = new Array();
        this.hitArrThisId = new Array();
        this._attrChangeMap = {};
        this._shieldMap = {};
    }

    update(dt: number) {
        this.updateBuff(dt);
        this.updateSkill(dt);
        if (this._lockTime > 0) {
            this._lockTime = this._lockTime - dt;
            return;
        }
        if (this.hasBuffState(BuffAndDotState.coma)) {
            return;
        }
        this.findTarget();
        this.move();
    }

    updateBuff(dt: number) {
        let tempT = new Array<ChessBuff>();
        for (let i = 0; i < this._buffArr.length; i++) {
            const buff = this._buffArr[i];
            buff.update(dt);
            if (buff.isValid) {
                tempT.push(buff);
            }
        }
        this._buffArr = tempT;
    }

    updateSkill(dt: number) {
        for (let i = 0; i < this._skillList.length; i++) {
            const skill = this._skillList[i];
            skill.update(dt);
        }
    }

    addBuff(buff: ChessBuff) {
        this._buffArr.push(buff);
    }

    addShield(shield: ChessShield) {
        this.addBuff(shield);
        if (!this._shieldMap[shield.name]) {
            this._shieldMap[shield.name] = new Array();
        }
        let infoArr: Array<ChessShield> = this._shieldMap[shield.name];
        infoArr.push(shield);
        shield.idx = infoArr.length - 1;
    }

    removeShield(shield: ChessShield) {
        let infoArr: Array<ChessShield> = this._shieldMap[shield.name];
        if (infoArr && infoArr[shield.idx]) {
            for (let i = shield.idx + 1; i < infoArr.length; i++) {
                const element = infoArr[i];
                element.idx = element.idx - 1;
            }
            infoArr.splice(shield.idx, 1);
        }
    }

    getShieldState(shieldName: string): Array<ChessShield> {
        return this._shieldMap[shieldName];
    }

    findTarget() {
        if (this.curTarget && !this.curTarget.isDead) {
            return true
        }
        this.setTarget(null);
        let dt = 100;
        let target = null;
        for (let i = 0; i < g_AutoBattleManager.getEnemyList(this).length; i++) {
            const npc = g_AutoBattleManager.getEnemyList(this)[i];
            if (!npc.isDead && g_Util.checkPosShortInRange(this.posX, this.posY, npc.posX, npc.posY, this.attRange)) {
                let dis = g_Util.getCityDistance(this, npc)
                if (dis < dt) {
                    dt = dis;
                    target = npc;
                } else if (dis == dt) {
                    let dy1 = Math.abs(this.posY - target.posY);
                    let dy2 = Math.abs(this.posY - npc.posY);
                    if (dy2 < dy1) {
                        target = npc;
                    } else if (dy1 == dy2) {
                        let dx1 = Math.abs(target.posX - 4);
                        let dx2 = Math.abs(npc.posX - 4);
                        if (dx2 < dx1) {
                            target = npc;
                        }
                    }
                }
            }
        }
        if (!target) {
            return false
        }
        this.setTarget(target);
        printBattleMsg(pTag.battle, pBattleAction.select, { npc: this, target: target });
        // console.log(this.printName + " 选择了一个目标： " + target.printName);
        return true
    }

    move() {
        if (this.curTarget && !this.curTarget.isDead
            && g_Util.checkPosShortInRange(this.posX, this.posY, this.curTarget.posX, this.curTarget.posY, this.attRange)) {
            return true
        }
        if (this.moveStep == 0) {
            return true
        }
        this.setTarget(null);
        let tempT = new Array<ChessNpc>();
        let npcList = g_AutoBattleManager.getEnemyList(this);
        for (let i = 0; i < npcList.length; i++) {
            tempT.push(npcList[i]);
        }
        if (this.career == CareerEnum.assissan) {
            this.assassinMove(tempT);
        } else {
            this.normalMove(tempT);
        }
    }

    assassinMove(tempT: Array<ChessNpc>) {
        if (tempT.length == 0) {
            return
        }
        //选目标
        let dx = 100
        let dy = 0
        let target = null
        let idx = 0
        for (let i = 0; i < tempT.length; i++) {
            const v = tempT[i];
            let dy1 = Math.abs(this.posY - v.posY);
            let dx1 = Math.abs(this.posX - v.posX);
            if (dy1 > dy) {
                target = v;
                idx = i;
                dy = dy1;
                dx = dx1;
            } else if (dy1 == dy) {
                if (dx1 < dx) {
                    target = v;
                    idx = i;
                    dx = dx1;
                } else if (dx1 == dx) {
                    dx1 = Math.abs(target.posX - 4);
                    let dx2 = Math.abs(v.posX - 4);
                    if (dx2 < dx1) {
                        idx = i;
                        target = v;
                    }
                }
            }
        }
        if (!target) {
            return
        }

        //添加候选位置
        let tempPosList = new Array();
        let chessTable = g_AutoBattleManager.chessTable;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!chessTable[i][j]) {
                    if (g_Util.checkPosShortInRange(i, j, target.posX, target.posY, this.attRange)) {
                        tempPosList.push({ x: i, y: j });
                    }
                }
            }

        }
        if (tempPosList.length == 0) {
            tempT.splice(idx, 1);
            this.assassinMove(tempT);
            return
        }
        this.setTarget(target);
        printBattleMsg(pTag.battle, pBattleAction.select, { npc: this, target: target });
        // console.log(this.printName + "选择了assassin目标" + target.printName);

        //选择移动位置
        dx = 10;
        dy = 0;
        let targetPos = null;
        for (let i = 0; i < tempPosList.length; i++) {
            const v = tempPosList[i];
            let dx1 = Math.abs(this.posX - v.x);
            let dy1 = Math.abs(this.posY - v.y);
            if (dy1 > dy) {
                targetPos = v;
                dy = dy1;
                dx = dx1;
            } else if (dy1 == dy) {
                if (dx1 < dx) {
                    targetPos = v;
                    dx = dx1;
                } else if (dx1 == dx) {
                    dx1 = Math.abs(targetPos.x - 4);
                    let dx2 = Math.abs(v.x - 4)
                    if (dx2 < dx1) {
                        targetPos = v;
                    }
                }
            }
        }
        if (targetPos) {
            this.moveTo(targetPos)
        }
    }

    normalMove(tempT: Array<ChessNpc>) {
        if (tempT.length == 0) {
            return
        }
        printDefault("normalMove");
        // 选目标
        let dt = 100
        let target = null
        let idx = 0
        for (let i = 0; i < tempT.length; i++) {
            const v = tempT[i];
            let dis = g_Util.getCityDistance(this, v);
            if (dis < dt) {
                dt = dis;
                target = v;
                idx = i;
            } else if (dis == dt) {
                let dy1 = Math.abs(this.posY - target.posY);
                let dy2 = Math.abs(this.posY - v.posY);
                if (dy2 < dy1) {
                    idx = i;
                    target = v;
                } else if (dy2 == dy1) {
                    let dx1 = Math.abs(target.posX - 4);
                    let dx2 = Math.abs(v.posX - 4);
                    if (dx2 < dx1) {
                        idx = i;
                        target = v;
                    }
                }
            }
        }
        if (!target) {
            return
        }
        //选位置
        let canMovePos = new Array();   //可移动到的位置
        let tempPosList = new Array();  //可以攻击到目标的候选位置
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!g_AutoBattleManager.chessTable[i][j]) {
                    if (g_Util.checkPosShortInRange(i, j, target.posX, target.posY, this.attRange)) {
                        tempPosList.push({ x: i, y: j });
                    }

                    if (g_Util.checkPosShortInRange(i, j, this.posX, this.posY, this.moveStep)) {
                        canMovePos.push({ x: i, y: j });
                    }
                }
            }
        }
        if (canMovePos.length == 0) {
            return
        }
        if (tempPosList.length == 0) {
            tempT.splice(idx, 1);
            this.normalMove(tempT);
            return
        }

        //在备选的可以攻击到目标的候选位置中选择一个下一步要移动到的位置
        dt = 100;
        let targetPos = null;
        for (let i = 0; i < tempPosList.length; i++) {
            let v = tempPosList[i]
            for (let j = 0; j < canMovePos.length; j++) {
                let w = canMovePos[j]
                let dis = g_Util.getCityDistance(v.x, v.y, w.x, w.y)
                if (dis < dt) {
                    dt = dis;
                    targetPos = w;
                } else if (dis == dt) {
                    let dy1 = Math.abs(this.posY - targetPos.y);
                    let dy2 = Math.abs(this.posY - w.y);
                    if (dy2 < dy1) {
                        targetPos = w;
                    } else if (dy1 == dy2) {
                        let dx1 = Math.abs(targetPos.x - 4);
                        let dx2 = Math.abs(w.x - 4);
                        if (dx2 < dx1) {
                            targetPos = w;
                        }
                    }
                }

            }

        }
        this.setTarget(target);
        printBattleMsg(pTag.battle, pBattleAction.select, { npc: this, target: target });
        // console.log(this.printName + " 选择了目标： " + target.printName);
        if (targetPos) {
            this.moveTo(targetPos);
        }
    }

    moveTo(targetPos: { x: number, y: number }) {
        let chessTable = g_AutoBattleManager.chessTable;
        if (chessTable[targetPos.x][targetPos.y]) {
            printDefault("移动失败");
            return false;
        }
        chessTable[targetPos.x][targetPos.y] = this;
        chessTable[this.posX][this.posY] = null;
        let dt = g_Util.getDistance(this.posX, this.posY, targetPos.x, targetPos.y);
        this._lockTime = dt * this.mvSpeed;
        let dirX = targetPos.x - this.posX;
        let dirY = targetPos.y - this.posY;
        this.dir = g_Util.getDir(dirX, dirY);
        this.posX = targetPos.x;
        this.posY = targetPos.y;
        printBattleMsg(pTag.battle, pBattleAction.move, { npc: this, pos: this._pos });
        this._lockTime = this._lockTime + 500;
    }

    attack() {
        if (this._lockTime > 0) {
            return;
        }
        if (this.hasBuffState(BuffAndDotState.coma)) {
            printBattleMsg(pTag.battle, pBattleAction.coma, { npc: this });
            return;
        }
        printBattleMsg(pTag.battle, pBattleAction.tryAttack, { npc: this });

        let curSkill = this.getCurSkill();
        if (!curSkill) {
            return
        }

        curSkill.play(this, this.curTarget);
    }

    playSkill(skillId: number) {

    }

    die() {
        this._isDead = true;
        for (const thisId in this.hitArrThisId) {
            let npc = g_AutoBattleManager.getChessNpcByThisId(Number(thisId));
            if (npc && npc.curTarget == this) {
                if (npc.hasBuffState(BuffAndDotState.beSneer)) {
                    npc.removeBuffState(BuffAndDotState.beSneer);
                }
                npc.curTarget = null;
            }
        }
        let boom = this.getAttrChange("boom");
        if (boom && boom.length > 0) {
            let boomInfo = boom[0].info;
            let dpsInfo = g_AutoBattleManager.getDpsInfo(this.thisId);
            let damage = 0;
            if (dpsInfo) {
                damage = boomInfo.damagePer * dpsInfo.dps / 100;
            }
            let effInfo = new EffectInfo();
            effInfo.init(SkillEffectEnum.damage, [damage, DamageType.normal]);
            let hitNpcList = g_AutoBattleManager.getEnemyList(this);
            for (let i = 0; i < hitNpcList.length; i++) {
                const defender = hitNpcList[i];
                let effData = new EffData(effInfo, this, defender);
                skillEffects[SkillEffectEnum.damage].play(effData);
                defender.addBuff(new ChessBuff(boomInfo.comaTime, 0, defender, null, BuffAndDotState.coma));
            }
        }
    }

    /**
     * 初始化技能
     */
    initSkillList() {
        this._skillList = new Array();
        let normalSkill = new NormalSkill(this.normalSkillId, this);
        this._skillList.push(normalSkill);
        if (this.skillId != 0) {
            let skill = new ChessSkill(this.skillId, this.level);
            if (skill.isActive) {
                this._skillList.push(skill);
            } else {
                skill.play(this);
            }
        }
    }

    /**
     * 选择一个当前可用的技能
     */
    getCurSkill(): ChessSkill {
        let curSkill: ChessSkill = null;
        for (let i = 0; i < this._skillList.length; i++) {
            const skill = this._skillList[i];
            if (skill.id == this.normalSkillId &&
                (this.hasBuffState(BuffAndDotState.beDisarm) ||
                    this.hasBuffState(BuffAndDotState.beBanish))) {
                continue
            }
            if ((this.hasBuffState(BuffAndDotState.beSneer) || this.hasBuffState(BuffAndDotState.silent))
                && skill.id == this.skillId) {
                continue
            }
            if (skill.curCdTime <= 0 && this.mp >= skill.mpCost) {
                if (!curSkill) {
                    curSkill = skill;
                } else if (skill.mpCost > curSkill.mpCost) {
                    curSkill = skill;
                }
            }
        }
        return curSkill
    }

    addAttrChange(attrName: string, info: AttrChangeInfo) {
        if (!this._attrChangeMap[attrName]) {
            this._attrChangeMap[attrName] = new Array();
        }
        let infoArr: Array<AttrChangeInfo> = this._attrChangeMap[attrName];
        infoArr.push(info);
        info.idx = infoArr.length - 1;
    }

    removeAttrChange(attrName: string, idx: number) {
        let infoArr: Array<AttrChangeInfo> = this._attrChangeMap[attrName]
        if (infoArr && infoArr[idx]) {
            for (let i = idx + 1; i < infoArr.length; i++) {
                const element = infoArr[i];
                element.idx = element.idx - 1;
            }
            infoArr.splice(idx, 1);
        }
    }

    getAttrChange(attrName: string): Array<AttrChangeInfo> {
        return this._attrChangeMap[attrName];
    }


    // addShieldState(shield: ChessShield) {
    //     if (!this._attrShieldMap[shield.name]) {
    //         this._attrShieldMap[shield.name] = new Array();
    //     }
    //     let infoArr: Array<ChessShield> = this._attrShieldMap[shield.name];
    //     infoArr.push(shield);
    //     shield.idx = infoArr.length - 1;
    // }

    // removeShieldState(attrName: string, idx: number) {
    //     let infoArr: Array<AttrChangeInfo> = this._attrShieldMap[attrName]
    //     if (infoArr && infoArr[idx]) {
    //         for (let i = idx + 1; i < infoArr.length; i++) {
    //             const element = infoArr[i];
    //             element.idx = element.idx - 1;
    //         }
    //         infoArr.splice(idx, 1);
    //     }
    // }

    // getShieldState(attrName: string): Array<AttrChangeInfo> {
    //     return this._attrShieldMap[attrName];
    // }

    addBuffState(state: BuffAndDotState) {
        if (!this._buffStateArr[state]) {
            this._buffStateArr[state] = 0;
        }
        this._buffStateArr[state] = this._buffStateArr[state] + 1;
    }

    removeBuffState(state: BuffAndDotState) {
        if (!this._buffStateArr[state]) {
            this._buffStateArr[state] = 0;
        }
        this._buffStateArr[state] = this._buffStateArr[state] - 1;
    }

    hasBuffState(state: BuffAndDotState) {
        let count = this._buffStateArr[state];
        if (!count || count == 0) {
            return false;
        }
        return true
    }

    public setTarget(target: ChessNpc) {
        if (this.curTarget) {
            this.curTarget.hitArrThisId[this.thisId] = null;
        }
        this.curTarget = target;
        if (target) {
            target.hitArrThisId[this.thisId] = 1;
            this.curTargetThisId = target.thisId;
        } else {
            this.curTargetThisId = null;
        }
    }

    public setPosition(x: number, y: number) {
        this._pos.x = x;
        this._pos.y = y;
    }

    public getPosition() {
        return this._pos;
    }

    public get isDead(): boolean {
        return this._isDead;
    }

    public set posX(v: number) {
        this._pos.x = v;
    }

    public get posX(): number {
        return this._pos.x;
    }

    public set posY(v: number) {
        this._pos.y = v;
    }

    public get posY(): number {
        return this._pos.y;
    }

    public get isTeamA(): boolean {
        return this.teamA;
    }

    public set hp(v: number) {
        this._hp = v;
    }

    /**
     * 基础hp+buff增减hp
     */
    public get hp(): number {
        let value = this._hp;
        let attrChange = this.getAttrChange('maxHp');
        if (attrChange && attrChange.length > 0) {
            for (let i = 0; i < attrChange.length; i++) {
                const info = attrChange[i];
                value = value + info.info;
            }
        }
        return value;
    }

    /**
     * 基础hp
     */
    public getHp(): number {
        return this._hp;
    }

    reduceHp(hp: number) {
        this._hp = this._hp - hp;
        if (this._hp > this.baseHp) {
            this._hp = this.baseHp;
        }
    }

    public set maxHp(v: number) {
        this._maxHp = v;
    }

    public get maxHp(): number {
        let value = this._maxHp;
        let attrChange = this.getAttrChange('maxHp');
        if (attrChange && attrChange.length > 0) {
            for (let i = 0; i < attrChange.length; i++) {
                const info = attrChange[i];
                value = value + info.info;
            }
        }
        return value;
    }

    public set mp(v: number) {
        if (v > 100) {
            v = 100;
        }
        this._mp = v;
    }

    public get mp(): number {
        return this._mp;
    }

    public set maxMp(v: number) {
        this._maxMp = v;
    }

    public get maxMp(): number {
        return this._maxMp;
    }

    public set damage(v: number) {
        this._damage = v;
    }

    public get damage(): number {
        let value = this._damage;
        let attrChange = this.getAttrChange("damage")
        if (attrChange && attrChange.length > 0) {
            for (let i = 0; i < attrChange.length; i++) {
                const info = attrChange[i];
                value = value + info.info;
            }
        }
        return value;
    }

    public set defence(v: number) {
        this._defence = v;
    }

    public get defence(): number {
        let value = this._defence;
        let attrChange = this.getAttrChange("defence")
        if (attrChange && attrChange.length > 0) {
            for (let i = 0; i < attrChange.length; i++) {
                const info = attrChange[i];
                value = value + info.info;
            }
        }
        return value;
    }

    public set mDefence(v: number) {
        this._mDefence = v;
    }

    public get mDefence(): number {
        let value = (100 - this._mDefence) / 100.0;
        let attrChange = this.getAttrChange("mDefence")
        if (attrChange && attrChange.length > 0) {
            for (let i = 0; i < attrChange.length; i++) {
                const info = attrChange[i];
                value = value * (100 - info.info) / 100.0;
            }
        }

        let warFever = this.getAttrChange("warFever");
        if (warFever && warFever.length > 0) {
            let info = warFever[0].info;
            let hpPercent = Math.floor((this.hp / this.maxHp) * 100);
            let per = info.mDefence * (100 - hpPercent);
            value = value * (100 - per) / 100.0;
        }
        value = Math.floor(100 - value * 100);

        return value;
    }

    public set attSpeed(v: number) {
        this._attSpeed = v;
    }

    public get attSpeed(): number {
        let value = this._attSpeed;
        let attrChange = this.getAttrChange("attackSpeed")
        if (attrChange && attrChange.length > 0) {
            for (let i = 0; i < attrChange.length; i++) {
                const info = attrChange[i];
                value = value + info.info;
            }
        }

        let warFever = this.getAttrChange("warFever");
        if (warFever && warFever.length > 0) {
            let info = warFever[0].info;
            let hpPercent = Math.floor((this.hp / this.maxHp) * 100);
            value = value + info.attackSpeed * (100 - hpPercent);
        }
        return value;
    }

    public set attRange(v: number) {
        this._attRange = v;
    }

    public get attRange(): number {
        return this._attRange;
    }

    public set speed(v: number) {
        this._speed = v;
    }

    public get speed(): number {
        return this._speed;
    }

    public set mvSpeed(v: number) {
        this._mvSpeed = v;
    }

    public get mvSpeed(): number {
        return this._mvSpeed;
    }

    public set level(v: number) {
        this._level = v;
    }

    public get level(): number {
        return this._level;
    }

    public get name(): string {
        return this.baseData.name;
    }

    public get baseHp(): number {
        return this.baseData.hp * Math.pow(2, this.level - 1);
    }

    public get baseMp(): number {
        return this.baseData.mp;
    }

    public get baseDamage(): number {
        return this.baseData.damage * Math.pow(2, this.level - 1);
    }

    public get baseDefence(): number {
        return this.baseData.defence;
    }

    public get baseMDefence(): number {
        return this.baseData.mdefence;
    }

    public get baseAttSpeed(): number {
        return this.baseData.attaSpeed;
    }

    public get baseAttRange(): number {
        return this.baseData.attackRange;
    }

    public get baseSpeed(): number {
        return this.baseData.speed;
    }

    public get baseMvSpeed(): number {
        return this.baseData.mvSpeed;
    }

    public get race(): number {
        return this.baseData.race;
    }

    public get career(): number {
        return this.baseData.career;
    }

    public get moveStep(): number {
        return this.baseData.mvStep;
    }

    public get normalSkillId(): number {
        return this.baseData.normalSkill;
    }

    public get skillId(): number {
        return this.baseData.skill;
    }



    public get printName(): string {
        let str = this.isTeamA ? "A:" : "B:"
        str = str + this.name + "(" + this.hp + "," + this.mp + ")";
        return str;
    }

    isSameTeam(npc: ChessNpc): boolean {
        return this.isTeamA == npc.isTeamA;
    }
}

export class ChessPet extends ChessNpc {
    readonly masterId: number;
    constructor(thisId: number, baseId: number, level: number, isTeamA: boolean, masterId: number) {
        super(thisId, baseId, level, isTeamA);
        this.masterId = masterId;
    }
}