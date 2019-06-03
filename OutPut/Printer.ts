import { WarCry } from "../SkillEffect/WarCry";

/**
 * 用于控制打印日志信息
 */

export enum pTag {
    default = 0,
    battle,
}

export enum pBattleAction {
    default = 0,
    prepare,
    select,
    move,
    tryAttack,
    attack,
    damage,
    doSkillEffect,
    playSkill,
    initSkill,
    recoverHp,
    coma,
    crit,
    warCry,
    recoverMp,
    critSilent,
    banish,
    miss,
    cdTime,
    addDebuff,
    addDamage,
    missDamage,
    bloodSacrificeRecoverHp,
    bkb,
}

export enum pErrTag {
    default = 0,
    inputNull,
    randomNum,
}

var filterActionTag = [
    pBattleAction.initSkill,
    pBattleAction.select,
    pBattleAction.tryAttack,
    // pBattleAction.doSkillEffect,
    // pBattleAction.damage,
];

export function printDefault(msg: any) {
    // return;
    console.log(msg);
}

export function printChessTable(msg: any) {
    // return;
    console.log(msg);
}

/**
 * 打印异常信息
 */
export function printErrMsg(tag: pErrTag, msg?: any) {
    let content = "";
    switch (tag) {
        case pErrTag.inputNull:
            content = `没有有效的对局信息`;
            break;
        case pErrTag.randomNum:
            content = `无效的随机数 max:${msg.max}, rad:${msg.rad}`;
            break;

        default:
            content = msg;
            break;
    }
    console.log(content);
}

export function printBattleMsg(tag: pTag, action: pBattleAction, msg?: any) {
    // return;
    for (let i = 0; i < filterActionTag.length; i++) {
        const tag = filterActionTag[i];
        if (action == tag) {
            return;
        }
    }
    let content = "";
    switch (tag) {
        case pTag.battle:
            switch (action) {
                case pBattleAction.default:
                    content = msg;
                    break;
                case pBattleAction.prepare:
                    content = msg;
                    break;
                case pBattleAction.select:
                    if (msg.target) {
                        content = `${msg.npc.printName} 选择了目标: ${msg.target.printName}`;
                    } else {
                        content = `${msg.npc.printName} 取消了对当前目标的选中`;
                    }
                    break;
                case pBattleAction.move:
                    content = `${msg.npc.printName} 移动到 (${msg.pos.x},${msg.pos.y})`;
                    break;
                case pBattleAction.tryAttack:
                    content = `${msg.npc.printName} 尝试攻击`;
                    break;
                case pBattleAction.damage:
                    content = `${msg.attacker.printName} 对 ${msg.defender.printName} 造成 ${msg.damage} 伤害`;
                    break;
                case pBattleAction.playSkill:
                    if (msg.attacker && msg.defender) {
                        content = `${msg.attacker.printName} 对 ${msg.defender.printName} 释放技能 ${msg.skillName}`;
                    } else if (msg.attacker) {
                        content = `${msg.attacker.printName} 释放技能 ${msg.skill}`;
                    } else {
                        content = `释放技能 ${msg.skill}`;
                    }
                    break;
                case pBattleAction.initSkill:
                    content = `初始化技能 ${msg.skillName}`;
                    break;
                case pBattleAction.doSkillEffect:
                    content = `play ${msg}`;
                    break;
                case pBattleAction.attack:
                    break;
                case pBattleAction.recoverHp:
                    content = `${msg.attacker.name} 为 ${msg.defender.printName} 回复血量 ${msg.hp}`;
                    break;
                case pBattleAction.coma:
                    content = `${msg.npc.printName} 眩晕中`;
                    break;
                case pBattleAction.crit:
                    content = `${msg.npc.printName} 触发了暴击，暴击伤害(未减免)：${msg.damage}`;
                    break;
                case pBattleAction.warCry:
                    if (msg.per == 1) {
                        return;
                    }
                    content = `${msg.npc.printName} 战吼效果减伤 ${(1 - msg.per) * 100}`;
                    break;
                case pBattleAction.recoverMp:
                    content = `${msg.npc.printName} 回复魔法 ${msg.mp}`;
                    break;
                case pBattleAction.critSilent:
                    content = `${msg.attacker.printName} 的暴击沉默了 ${msg.defender.printName} ${msg.time}秒`;
                    break;
                case pBattleAction.addDebuff:
                    content = `负面效果持续时间${msg.time}`;
                    break;
                case pBattleAction.addDamage:
                    content = `护盾增加攻击力${msg.des}${msg.damage}`;
                    break;
                case pBattleAction.missDamage:
                    content = '护盾抵挡伤害';
                    break;
                case pBattleAction.bloodSacrificeRecoverHp:
                    content = `血之祭祀恢复血量${msg.hp}`;
                    break;
                case pBattleAction.banish:
                    break;
                case pBattleAction.miss:
                    content = `${msg.defender.printName} 闪避了 ${msg.attacker.printName} 的攻击`;
                    break;
                case pBattleAction.cdTime:
                    content = `${msg.skillName} 技能cd：${msg.cd}`;
                    break;
                case pBattleAction.bkb:
                    content = `${msg.defender.printName} 对技能免疫`;
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }

    console.log(content);
}