const authResolver = require('./auth');
const handlePoint = require('./point');
const handleDustbin = require('./dustbin');

const rootResolver = {
    ...authResolver,
    ...handlePoint,
    ...handleDustbin,
}

module.exports = rootResolver;