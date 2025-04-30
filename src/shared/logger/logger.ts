import { DateTime } from 'luxon';

export class Logger {
    private static get timestamp() {
        return DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss.SSS');
    }

    /**
     * Prints given message to stdout
     */
    public static info(msg: string, ...data: any[]) {
        console.log(this.timestamp, '[INFO]', msg, ...data);
    }

    /**
     * Prints given message as error
     */
    public static error(msg: string, ...data: any[]) {
        console.error(this.timestamp, '[ERROR]', msg, ...data);
        console.trace();
    }

    /**
     * Prints given message and calls `proces.exit(1)`
     */
    public static fatal(msg: string, ...data: any[]) {
        console.log(this.timestamp, '[ERROR]', msg, ...data);
        process.exit(1);
    }
}
