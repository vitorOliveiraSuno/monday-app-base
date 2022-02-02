const mondayService = require('../services/monday-service');

async function atualizacao(req, res) {

    const { shortLivedToken } = req.session;
    const { payload } = req.body;

    try {
        return res.status(200).send({ message: "sucesso" })
    } catch (err) {
        console.error(err);
        return res.status(404).send({ message: 'Erro na controler' });
    }
}


module.exports = {
    atualizacao
};
