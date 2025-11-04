let context;

module.exports.get = () => context;

module.exports.set = (ctx) => {
    context = ctx;
};
