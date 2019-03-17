import chalk from 'chalk'

const log = console.log
const warn = console.warn
const error = console.error
const info = console.info

export const blue = chalk.blue
export const red = chalk.red
export const yellow = chalk.yellow
export const green = chalk.green

export const bold = chalk.bold
export const underline = chalk.underline

export default new class Logger {

    public success = (message: string) => {
        log(chalk`${green.bold('[SUCCESS]')} - ${green(message)}`)
    }

    public info = (message: string) => {
        info(chalk`${blue.bold('[INFO]')} - ${blue(message)}`)
    }

    public warn = (message: string) => {
        warn(chalk`${yellow.bold('[WARN]')} - ${yellow(message)}`)
    }

    public error = (message: string) => {
        error(chalk`${red.bold('[ERROR]')} - ${red(message)}`)
    }
}


