import { Logger } from '../logger/logger';

export function getEnvString(variableName: string): string {
    const val = process.env[variableName];

    if (!val) {
        Logger.fatal(`No ${variableName} env variable provided`);
    }

    return val;
}

export function getEnvInt(variableName: string): number {
    const val = getEnvString(variableName);

    const valNum = parseInt(val);

    if (isNaN(valNum)) {
        Logger.fatal(`Variable ${variableName} is not a number`);
    }

    return valNum;
}
