import { ChessNpc } from "./ChessNpc";
/**
 * @description 野怪
 */

export class ChessMonster extends ChessNpc {
    constructor(thisId: number, baseId: number, level: number, teamA: boolean) {
        super(thisId, baseId, level, teamA);
    }
}