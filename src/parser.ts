export default class Parser {
    checkError(str: string) {
        const failRegExp = /authentication token does not match/;
        const koRegExp = /KO/;
        if (failRegExp.test(str)) {
            const err = new Error('authentication token does not match');
            return err;
        }
        else if (koRegExp.test(str)) {
            const err = new Error(str.trim());
            return err;
        }
        else return undefined;
    }

}