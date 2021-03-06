var warnings = [];

function Warn(user) {
    var count = 0;

    if (warnings.length <= 0) {
        warnings.push({ usr: user, count: 0 });
    }

    if (!warnings.some(e => e.usr == user)) {
        warnings.push({ usr: user, count: 0 });
    }

    warnings.forEach(element => {
        if (element.usr == user) {
            element.count++;
            count = element.count;
        }
    });

    return count;
}

exports.Warn = Warn;