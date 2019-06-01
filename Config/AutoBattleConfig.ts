export enum CareerEnum {
    warrior = 1,
    magic = 2,
    assissan = 3,
}

export var careerBuffConfig: any = {
    [CareerEnum.warrior]: {
        [3]: 2011,
        [6]: 2012,

    },
    [CareerEnum.magic]: {
        [3]: 2021,
        [6]: 2022,
    },
    [CareerEnum.assissan]: {
        [3]: 2031,
        [6]: 2032,
    },
}

export enum RaceEnum {
    orc = 1,
    wild,
    human,
    bloodElf,
    dwarf,
    troll,
}

export var raceBuffConfig: any = {
    [RaceEnum.orc]: {
        [2]: 3011,
        [4]: 3012,
    },
    [RaceEnum.wild]: {
        [2]: 3021,
        [4]: 3022,
    },
    [RaceEnum.human]: {
        [2]: 3031,
        [4]: 3032,
    },
    [RaceEnum.bloodElf]: {
        [2]: 3041,
        [4]: 3042,
    },
    [RaceEnum.dwarf]: {
        [2]: 3051,
        [4]: 3052,
    },
    [RaceEnum.troll]: {
        [2]: 3061,
        [4]: 3062,
    },
}


export var dirConfig = [
    { x: 0, y: -1, },
    { x: 1, y: -1, },
    { x: 1, y: 0, },
    { x: 1, y: 1, },
    { x: 0, y: 1, },
    { x: -1, y: 1, },
    { x: -1, y: 0, },
    { x: -1, y: -1, },
]

export var attackRangeConfig = [
    [0],
    [1, 0],
    [2, 1, 0],
    [3, 3, 2, 1],
    [4, 4, 4, 3, 2],
    [5, 5, 5, 5, 4, 3],
    [6, 6, 6, 6, 5, 4, 3],
    [7, 7, 7, 7, 6, 6, 5, 3]
]

export var ATTACK_BASE_TIME = 1.5

export var damageK = {
    k1: 0.04,
    k2: 1,
    k3: 0.04,
}
