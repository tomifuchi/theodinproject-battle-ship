function Logger(name) {
    let logs = '';
    const state = {
        name,
        logCounter: 0,
    };

    return Object.assign(
        Object.create({
            log: function (msg) {return logs = `${this.logCounter++}: ${msg}\n\n${logs}`},
            getLog: function () {return logs},
        }),
        state
    );
}

module.exports = Logger;