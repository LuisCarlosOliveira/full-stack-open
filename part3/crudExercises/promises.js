//Enunciado:Cria uma função esperarTempo(ms) que retorna uma Promise
// que resolve após os milissegundos especificados com a mensagem "Tempo esgotado!".
function esperarTempo(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Tempo esgotado!");
    }, ms);
  });
}

//other solutions:
async function esperarTempo(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
    return "Tempo esgotado!";
}

function esperarTempo(ms) {
    return new Promise((resolve, reject) => {
        if (ms < 0) {
            reject(new Error("Tempo inválido"));
        } else {
            setTimeout(() => resolve("Tempo esgotado!"), ms);
        }
    });
}

// Teste:
esperarTempo(2000).then(mensagem => console.log(mensagem));

//----------------------------------------------------------

/**
 * Cria uma função numeroAleatorio() que:
    Resolve com "Sucesso!" se um número aleatório for > 0.5
    Rejeita com "Falha!" caso contrário
 */
function numeroAleatorio() {
    return new Promise((resolve, reject) => {
        if(Math.random() > 0.5){
            resolve("Sucess!");
        }else{
            reject("Fail")
        }
    });
}

//other solutions:
async function numeroAleatorio() {
    if (Math.random() > 0.5) {
        return "Sucesso!";
    } else {
        throw "Falha!";
    }
}

// Teste:
numeroAleatorio()
    .then(resultado => console.log("Resultado:", resultado))
    .catch(erro => console.log("Erro:", erro));
