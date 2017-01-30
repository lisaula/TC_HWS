export class StateAlreadyExistError extends Error {
    constructor(stateName) {
        super(`The state '${stateName}' already exist in Q`)
    }
}

export class StateNotFoundError extends Error {
    constructor(stateName) {
        super(`The state '${stateName}' was not found in Q`)
    }
}

export class CharNotFoundError extends Error {
    constructor(charName) {
        super(`The caracter '${charName}' was not found in alphabet`)
    }
}

export class AFDError extends Error {
    constructor(state, arrowName) {
        super(`The transition'${arrowName}' already exist in '${state.name}'`)
    }
}

export class noArrowError extends Error {
    constructor(stateName, a) {
        super(`The state '${stateName}' has no associated arrow '${a}'`)
    }
}
