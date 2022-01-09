import axios from 'axios';
import {
    cadastraUsuario, dataDeCadastro, verificaErro, fazLogin, logout, resetSenha,
    editaPerfil, consultaDadosDoUsuario, mostraCandidatura, auth, cancelaCandidatura
} from '../functions/User.js';

//esta função carrega os municípios do Ceará fornecidos pela api do IBGE 
var municipios;
axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/23/municipios')
    .then(function (response) {
        municipios = response.data
    })

export const getCadastro = async (req, res) => {
    res.render('Paginas/Cadastro/index', { municipios });
}

export const postCadastro = async (req, res) => {
    const dados_de_cadastro = {
        CPF: req.body.CPF,
        Nome_completo: req.body.nome_completo,
        Nome_social: req.body.nome_social,
        Gênero: req.body.genero,
        Data_de_nascimento: req.body.data_de_nascimento,
        Email: req.body.email,
        Telefone: req.body.fone,
        Município: req.body.municipio,
        Bairro: req.body.bairro,
        Data_de_cadastramento: dataDeCadastro()
    }
    cadastraUsuario(req.body.email, req.body.senha, dados_de_cadastro).then(() => {
        res.redirect('/user/perfil');
    })
        .catch((error) => {
            const errorCode = error.code;
            let mensagemDeErro = verificaErro(errorCode);
            res.render('Paginas/Cadastro/index', { municipios, mensagemDeErro });
        });
}

export const getLogin = (req, res) => {
    res.render('Paginas/Login/index')
}

export const postLogin = (req, res) => {
    fazLogin(req.body.email, req.body.senha).then((userCredential) => {
        res.redirect('/user/perfil')
    })
        .catch((error) => {
            const errorCode = error.code;
            let mensagemDeErro = verificaErro(errorCode);
            res.render("Paginas/Login/index", { mensagemDeErro })
        });
}

export const getLogout = (req, res, next) => {
    logout().then(() => {
        res.redirect('/')
    })
}

export const getReauth = (req, res) => {
    res.render('Paginas/Login/reautenticacao');

}

export const postReauth = (req, res) => {
    resetSenha(req.body.email)
}

export const getPerfil = (req, res) => {
    const user_id = auth.currentUser.uid
    mostraCandidatura(user_id).then((candidatura) => {
        res.render('Paginas/Perfil/index', { candidatura })
    })
}

export const postPerfil = (req, res) => {
    const user_id = auth.currentUser.uid
    const vaga_id = req.body.vaga_id
    cancelaCandidatura(user_id, vaga_id).then(() => {
        res.redirect('/user/perfil')
    })
}

export const getEditPerfil = (req, res) => {
    consultaDadosDoUsuario().then((dados) => {
        res.render('Paginas/Perfil/edit', { municipios });
    })
}

export const postEditPerfil = (req, res) => {
    var dados = {
        CPF: req.body.CPF,
        Nome_completo: req.body.nome_completo,
        Nome_social: req.body.nome_social,
        Gênero: req.body.genero,
        Data_de_nascimento: req.body.data_de_nascimento,
        Email: req.body.email,
        Telefone: req.body.fone,
        Município: req.body.municipio,
        Bairro: req.body.bairro,
        Endereço: req.body.endereco,
        Número: req.body.n,
    }
    editaPerfil(req.body.email, dados).then(() => {
        const mensagem = "Dados editados com sucesso"
        res.render('Paginas/Perfil/edit', { mensagem })
    })
        .catch((error) => {
            const errorCode = error.code;
            let mensagemDeErro = verificaErro(errorCode);
            res.render('Paginas/Perfil/edit', { municipios, mensagemDeErro });
        });
}