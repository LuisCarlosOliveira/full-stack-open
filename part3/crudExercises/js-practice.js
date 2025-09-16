const extrairDadosUsuario = (usuario) => {
  const { nome, email, idade = 0 } = usuario;
  return { nome, email, idade };
};

const combinarArrays = (...arrays) => {
  return [...new Set(arrays.flat())];
};

const buscarDados = async (url) => {
  // Simular delay de 1-2 segundos
  const delay = 1000 + Math.random() * 1000;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Validar URL
        if (!url) {
          throw new Error("URL é obrigatória");
        }

        // Retornar dados mockados baseados na URL
        if (url.includes("/usuarios")) {
          resolve({
            id: 1,
            nome: "João Silva",
            email: "joao@email.com",
          });
        } else if (url.includes("/produtos")) {
          resolve({
            id: 101,
            nome: "Notebook",
            preco: 2500.0,
          });
        } else {
          resolve({
            mensagem: "Dados genéricos",
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
};

// 4. Função que usa template literals para gerar HTML

const gerarCardUsuario = (usuario) => {
    if (!usuario) return '<div class="card">Usuário não encontrado</div>';
    
    const { nome, email, idade, avatar } = usuario;

    return `
        <div class="card">
            <h2>${nome || 'Nome não informado'}</h2>
            <p>${email || 'Email não informado'}</p>
            <p>${idade || 'Idade não informada'}</p>
            ${avatar ? `<img src="${avatar}" alt="Avatar">` : ''}
        </div>
    `;
};

// 5. Função que usa optional chaining

const acessarPropriedadeSegura = (objeto, caminho) => {
    // Dividir o caminho em partes
    const propriedades = caminho.split('.');
    
    // Usar optional chaining para acessar propriedades aninhadas
    let resultado = objeto;
    
    for (const prop of propriedades) {
        resultado = resultado?.[prop];
        if (resultado === undefined) break;
    }
    
    return resultado;
};
