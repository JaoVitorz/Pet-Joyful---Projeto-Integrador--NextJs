class IndexController {
    getIndex(req, res) {
        res.send('Bem-vindo à API Express!');
    }
}

module.exports = IndexController;