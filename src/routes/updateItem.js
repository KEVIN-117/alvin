const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateItem(req.params.id, {
        title: req.body.title,
        author: req.body.author,
    });
    const item = await db.getItem(req.params.id);
    res.send(item);
};
