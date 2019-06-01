import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";

export class NormalDamage extends BaseSkillEffect {
    constructor() {
        super();
    }

    public get effectId(): number {
        return SkillEffectEnum.damage;
    }

    public get effName(): string {
        return "normalDamage";
    }

    /**
     * play
     */
    public play(data: EffData): boolean {

        return true;
    }
}
