import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 闪光弹，使敌方目标短暂致盲，所有友军有[0]%的概率闪避攻击，持续[1]秒
 */
export class FlashBoom extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.flashBoom;
    }
    public get effName(): string {
        return "flashBoom";
    }

    public play(data: EffData): boolean {
        super.play(data);
        let per = data.skillEff.effArr[0];
        let lifeTime = data.skillEff.effArr[1];

        let hitNpc = g_AutoBattleManager.getFriendList(data.attacker);
        for (let i = 0; i < hitNpc.length; i++) {
            const defender = hitNpc[i];
            let buff = new ChessBuff(lifeTime, 0, defender);
            buff.setAttrChange("miss", per);
            defender.addBuff(buff);
        }

        return true;
    }
}