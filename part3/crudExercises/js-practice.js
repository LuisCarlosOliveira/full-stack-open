// 1. Função que usa destructuring para extrair dados de um objeto

const extrairDadosUsuario = (usuario) => {

    const {nome, email, idade = 0} = usuario;

    const user = {nome, email, idade};

    return user;

};