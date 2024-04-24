const db = require('../persistence');
const {v4 : uuid} = require('uuid');

module.exports = async (req, res) => {
    const item = {
        id: uuid(),
        title: req.body.title,
        author: req.body.author,
    };

    await db.storeItem(item);
    res.send(item);
};
