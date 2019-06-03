import { EffectInfo, EffData } from "./EffectInfo";
import { ChessNpc } from "./ChessNpc";
import { ATTACK_BASE_TIME } from "../Config/AutoBattleConfig";
import { skillEffects } from "../SkillEffect/InitSkillEffect";
import { BuffAndDotState, DamageType, SkillEffectEnum } from "../SkillEffect/SkillEffectEnum";
import { SkillBaseData } from "../TbxModel/SkillBaseData";
import { skillLevelData } from "../TbxModel/SkillLevelData";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { printBattleMsg, pTag, pBattleAction, printDefault } from "../OutPut/Printer";
import { g_Util } from "../Util";
import { ChessBuff } from "./ChessBuff";

enum SkillType {
    /**
     * 普攻技能
     */
    normal = 0,
    /**
     * 主动技能
     */
    active,
    /**
     * 被动技能
     */
    passive,
    /**
     * 种族技能
     */
    race,
    /**
     * 职业技能
     */
    career,
}

/**
 * 技能目标类型
 */
enum SkillTargetType {
    enemy = 0,
    myself,
    friend,
    /**
     * 当前方向
     */
    dir,
    /**
     * 目标地点
     */
    point,
    /**
     * 敌方最高星
     */
    enemyHighLevel,
    /**
     * 己方最低血量
     */
    friendLowHp,
    /**
     * 己方同职业
     */
    friendCareer = 11,
    /**
     * 己方同种族
     */
    friendRace,
    /**
     * 己方所有
     */
    friendAll,
    /**
     * 对方所有
     */
    enemyAll,
    /**
     * 场上所有
     */
    all,
}

export class ChessSkill {
    baseData: SkillBaseData;
    levelData: skillLevelData;
    initSuccess = false;
    id: number;
    curCdTime = 0;
    maxCdTime = 0;
    maxGcdTime = 0;
    targetType = 0;
    range = 0;
    mpCost = 0;
    skillEff: EffectInfo;

    constructor(skillId: number, level: number) {
        this.id = skillId;
        this.baseData = new SkillBaseData(skillId);
        this.levelData = new skillLevelData(skillId * 100 + level);
        this.skillEff = new EffectInfo();
        this.skillEff.initByStr(this.levelData.status);
        this.maxCdTime = this.levelData.cd;
        this.maxGcdTime = this.baseData.gcd;
        this.mpCost = this.levelData.mp;
        printBattleMsg(pTag.battle, pBattleAction.initSkill, { skillName: this.baseData.name });
    }

    play(attacker?: ChessNpc, defender?: ChessNpc) {
        if (!attacker || attacker.isDead) {
            return
        }
        switch (this.baseData.targetType) {
            case SkillTargetType.enemy:
                if (!defender || defender.isDead || defender.hasBuffState(BuffAndDotState.bkb)
                    || !g_Util.checkPosShortInRange(attacker.posX, attacker.posY, defender.posX, defender.posY, this.levelData.range)) {
                    if (defender && defender.hasBuffState(BuffAndDotState.bkb)) {
                        printBattleMsg(pTag.battle, pBattleAction.bkb, { defender });
                    }
                    return;
                }
                break;
            case SkillTargetType.myself:
                defender = attacker;
                break;
            case SkillTargetType.dir:
                break;
            case SkillTargetType.enemyHighLevel:
                break;
            default:
                break;
        }

        attacker.mp = attacker.mp - this.mpCost;
        printBattleMsg(pTag.battle, pBattleAction.playSkill, { attacker: attacker, defender: defender, skillName: this.baseData.name });
        let effId = this.skillEff.effId;
        let effData = new EffData(this.skillEff, attacker, defender);
        skillEffects[effId].play(effData);
        this.startCD(attacker);
    }

    update(dt: number) {
        if (this.curCdTime > 0) {
            this.curCdTime = this.curCdTime - dt;
            if (this.curCdTime < 0) {
                this.curCdTime = 0;
            }
        }
    }

    startCD(attacker: ChessNpc) {
        let reduceCdInfo = attacker.getAttrChange("reduceCD");
        let maxTime = this.maxCdTime;
        if (reduceCdInfo && reduceCdInfo.length > 0) {
            for (let i = 0; i < reduceCdInfo.length; i++) {
                const per = reduceCdInfo[i].info;
                maxTime = maxTime * (100 - per) / 100;
            }
        }
        this.curCdTime = Math.floor(maxTime);
        printBattleMsg(pTag.battle, pBattleAction.cdTime, { skillName: this.baseData.name, cd: this.curCdTime });
    }

    public get isActive(): boolean {
        return this.baseData.type == SkillType.normal || this.baseData.type == SkillType.active;
    }

}

/**
 * status: "effId,damageType"
 */
export class NormalSkill extends ChessSkill {
    constructor(skillId: number, npc: ChessNpc) {
        super(skillId, 1);
        this.refreshAttr(npc);
    }

    /**
     * 对于普攻附加的操作在这里处理
     * @param attacker 攻击者
     * @param defender 被攻击者
     */
    play(attacker?: ChessNpc, defender?: ChessNpc) {
        if (attacker.hasBuffState(BuffAndDotState.beDisarm)) {
            return;
        }
        this.refreshAttr(attacker);
        if (!defender || defender.isDead
            || !g_Util.checkPosShortInRange(attacker.posX, attacker.posY, attacker.curTarget.posX, attacker.curTarget.posY, attacker.attRange)) {
            return;
        }
        let effId = this.skillEff.effId;
        let damage = attacker.damage;
        let damageType = this.skillEff.effArr[1];
        //是否miss
        let missInfos = defender.getAttrChange("miss")
        if (missInfos && missInfos.length > 0) {
            for (let i = 0; i < missInfos.length; i++) {
                const info = missInfos[i];
                let rad = g_AutoBattleManager.getRandomNumber(100);
                if (rad <= info.info) {
                    this.startCD();
                    printBattleMsg(pTag.battle, pBattleAction.miss, { attacker: attacker, defender: defender });
                    return 0;
                }
            }
        }
        //是否添加折光添加伤害
        let addDamageShieldInfo = attacker.getShieldState("AddDamageShield")
        if (addDamageShieldInfo && addDamageShieldInfo.length > 0) {
            printBattleMsg(pTag.battle, pBattleAction.addDamage, { des: "pre", damage: damage });
            for (let i = 0; i < addDamageShieldInfo.length; i++) {
                const shield = addDamageShieldInfo[i];
                let arg = { damage: damage }
                shield.doShieldEffect(arg);
                damage = arg.damage;
            }
            printBattleMsg(pTag.battle, pBattleAction.addDamage, { des: "after", damage: damage });
        }
        //判断是否暴击
        let critInfos = attacker.getAttrChange("crit")
        if (critInfos && critInfos.length > 0) {
            let tempDamage = damage;
            for (let i = 0; i < critInfos.length; i++) {
                const info = critInfos[i];
                let rad = g_AutoBattleManager.getRandomNumber(100);
                if (rad <= info.info.per) {
                    damage = Math.max(damage, tempDamage * info.info.mul / 100);
                }
            }
            if (damage > attacker.damage) {
                printBattleMsg(pTag.battle, pBattleAction.crit, { npc: attacker, damage: damage });
                //暴击是否触发了沉默
                let silentInfos = attacker.getAttrChange("critSilent");
                if (silentInfos && silentInfos.length > 0) {
                    let buff = new ChessBuff(silentInfos[0].info, 0, defender, null, BuffAndDotState.silent);
                    defender.addBuff(buff);
                    printBattleMsg(pTag.battle, pBattleAction.critSilent, { attacker: attacker, defender: defender, time: silentInfos[0].info });
                }
                //血之祭祀的血量回复
                let bloodInfos = attacker.getAttrChange("bloodSacrifice");
                if (bloodInfos && bloodInfos.length > 0) {
                    for (let i = 0; i < bloodInfos.length; i++) {
                        const info = bloodInfos[i].info;
                        let recoverHp = damage * info / 100;
                        printBattleMsg(pTag.battle, pBattleAction.bloodSacrificeRecoverHp, { hp: recoverHp });
                        attacker.reduceHp(-recoverHp);
                    }
                }

            }
        }

        let effInfo = new EffectInfo();
        effInfo.init(effId, [damage, damageType]);
        let effData = new EffData(effInfo, attacker, defender);
        let rDamage = skillEffects[effId].play(effData);
        //附加溅射
        let sputterInfo = attacker.getAttrChange("sputtering");
        if (sputterInfo && sputterInfo.length > 0) {
            for (let i = 0; i < sputterInfo.length; i++) {
                const info = sputterInfo[i].info;
                let damage = Math.floor(rDamage * info.damagePer / 100);
                let hitList = skillEffects[SkillEffectEnum.damage].getRandomNpc(g_AutoBattleManager.getEnemyList(attacker), 100, info.range, defender.getPosition());
                let effInfo = new EffectInfo();
                effInfo.init(SkillEffectEnum.damage, [damage, damageType]);
                for (let j = 0; j < hitList.length; j++) {
                    const npc = hitList[j];
                    if (npc.thisId != defender.thisId) {
                        let effData = new EffData(effInfo, attacker, npc);
                        skillEffects[SkillEffectEnum.damage].play(effData);
                    }
                }
            }
        }
        //嗜血之矛附加伤害
        let bloodthirstySpearInfo = attacker.getAttrChange("bloodthirstySpear");
        if (bloodthirstySpearInfo && bloodthirstySpearInfo.length > 0) {
            let info = bloodthirstySpearInfo[0].info;
            attacker.reduceHp(info.hpReduce);
            let effInfo = new EffectInfo();
            effInfo.init(SkillEffectEnum.bloodthirstySpearBuff, [info.damage]);
            let effData = new EffData(effInfo, attacker, defender);
            let buff = new ChessBuff(info.lifeTime, 1000, defender, effData);
            defender.addBuff(buff);
        }
        //是否有manaBurn效果
        let manaBurnInfo = attacker.getAttrChange("manaBurn");
        if (manaBurnInfo && manaBurnInfo.length > 0) {
            let info = manaBurnInfo[0].info;
            let mp = Math.min(info.mana, defender.mp);
            defender.mp = defender.mp - mp;
            let damage = mp * info.damagePer / 100;
            let effInfo = new EffectInfo();
            effInfo.init(SkillEffectEnum.damage, [damage, DamageType.real]);
            let effData = new EffData(effInfo, attacker, defender);
            let rDamage = skillEffects[SkillEffectEnum.damage].play(effData);
        }
        this.startCD();
    }

    startCD() {
        this.curCdTime = this.maxCdTime;
        printBattleMsg(pTag.battle, pBattleAction.cdTime, { skillName: this.baseData.name, cd: this.curCdTime });
    }

    /**
     * 根据npc的数值更新普攻的数值
     */
    refreshAttr(npc: ChessNpc) {
        let attSpeed = npc.attSpeed;
        if (attSpeed <= 0) {
            attSpeed = 1;
        }
        this.maxCdTime = Math.floor(100.0 * ATTACK_BASE_TIME / npc.attSpeed * 1000);
        this.maxGcdTime = this.maxCdTime;
        this.range = npc.attRange;
    }
}

export class RaceSkill extends ChessSkill {
    race = 0;
    isTeamA = false;
    constructor(skillId: number, race: number, isTeamA: boolean) {
        super(skillId, 1);
        this.race = race;
        this.isTeamA = isTeamA;
    }
    play() {
        printDefault("play race skill")
        let effId = this.skillEff.effId;
        let effData = new EffData(this.skillEff);
        effData.race = this.race;

        let npcList: Array<ChessNpc>;
        switch (this.baseData.targetType) {
            case SkillTargetType.friendRace:
                printDefault("己方同种族" + this.race)
                npcList = this.isTeamA ? g_AutoBattleManager.npcListA : g_AutoBattleManager.npcListB;
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    if (npc.race == this.race) {
                        effData.defender = npc;
                        skillEffects[effId].play(effData);
                    }
                }
                break;
            case SkillTargetType.enemyAll:
                npcList = this.isTeamA ? g_AutoBattleManager.npcListB : g_AutoBattleManager.npcListA;
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    effData.defender = npc;
                    skillEffects[effId].play(effData);
                }
                break;
            case SkillTargetType.friendAll:
                npcList = this.isTeamA ? g_AutoBattleManager.npcListA : g_AutoBattleManager.npcListB;
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    effData.defender = npc;
                    skillEffects[effId].play(effData);
                }
                break;
            default:
                break;
        }
    }
}

export class CareerSkill extends ChessSkill {
    career = 0;
    isTeamA = false;
    constructor(skillId: number, career: number, isTeamA: boolean) {
        super(skillId, 1);
        this.career = Number(career);
        this.isTeamA = isTeamA;
    }
    play() {
        let effId = this.skillEff.effId;
        let effData = new EffData(this.skillEff);
        effData.career = this.career;

        let npcList: Array<ChessNpc>;
        switch (this.baseData.targetType) {
            case SkillTargetType.friendCareer:
                npcList = this.isTeamA ? g_AutoBattleManager.npcListA : g_AutoBattleManager.npcListB;
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    if (npc.career == this.career) {
                        effData.defender = npc;
                        skillEffects[effId].play(effData);
                    }
                }
                break;
            case SkillTargetType.enemyAll:
                npcList = this.isTeamA ? g_AutoBattleManager.npcListB : g_AutoBattleManager.npcListA;
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    effData.defender = npc;
                    skillEffects[effId].play(effData);
                }
                break;
            case SkillTargetType.friendAll:
                npcList = this.isTeamA ? g_AutoBattleManager.npcListA : g_AutoBattleManager.npcListB;
                for (let i = 0; i < npcList.length; i++) {
                    const npc = npcList[i];
                    effData.defender = npc;
                    skillEffects[effId].play(effData);
                }
                break;
            default:
                break;
        }
    }
}
