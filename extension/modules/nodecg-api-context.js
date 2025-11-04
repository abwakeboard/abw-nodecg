let context;

module.exports.get = function () {
    return context;
};

module.exports.set = function (ctx) {
    context = ctx;
};
