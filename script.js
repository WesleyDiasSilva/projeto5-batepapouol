const usuario = document.getElementById('login');
const botaoLogin = document.querySelector('.botao-login');
const msgErroLogin = document.querySelector('.mensagemErro');
const spinner = document.querySelector('.spinner')
const telaLogin = document.querySelector('.login')
const menuSuperior = document.querySelector('.menu-superior')
const chat = document.querySelector('.chat')
const barraInferior = document.querySelector('.barra-inferior')

botaoLogin.addEventListener('click', login);

renderizarMensagens();

function msgErro(text = 'Preencha o nome por favor!'){
  msgErroLogin.innerHTML = text;
  setTimeout(() => {
    msgErroLogin.innerHTML = ''
  },5000)
}


let user;

function login(){
  console.log(usuario.value)
  if(usuario.value !== null && usuario.value !== undefined && usuario.value !== ' ' && usuario.value !== '' && usuario.value.length > 1){
    
    user = {name: usuario.value}
    const resposta = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', user)
    resposta.then(() => {
      transicaoLogin();
      setInterval(atualizaStatus, 4000, user);
      setInterval(renderizarMensagens, 3000)
    }).catch(() => {
      msgErro('Já existe um usuário logado com este nome, por favor, entre com outro nome!')
    })
  }
}

function atualizaStatus(user){
  let respostaAtualiza = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
  respostaAtualiza
  .then()
  .catch(() => {
    voltaLogin('Você foi desconectado do servidor, por favor, coloque seu nome para entrar novamente!')
  })
}

function transicaoLogin(){
  spinner.classList.remove('disable')
  setTimeout(() => {
    spinner.classList.add('disable');
    telaLogin.classList.add('disable');
    menuSuperior.classList.remove('disable');
    chat.classList.remove('disable');
    barraInferior.classList.remove('desativado');
  }, 4000)
}

function voltaLogin(msg){
  telaLogin.classList.remove('disable');
  menuSuperior.classList.add('disable');
  chat.classList.add('disable');
  barraInferior.classList.add('desativado');
  msgErro(msg);
}

function renderizarMensagens(){
  let resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  resposta.then((response) => {
    chat.innerHTML = '';
    console.log('deu certo')
    response.data.forEach((item) => {
      if(item.type === 'status'){
        chat.innerHTML = chat.innerHTML + `<li class="mensagem status"><span class="horario">(${item.time})</span> <span class="nome">${item.from}</span> ${item.text}</li>`
      }

      if(item.type === 'message' && item.to === 'Todos'){
        chat.innerHTML = chat.innerHTML + `<li class="mensagem normal"><span class="horario">(${item.time})</span> <span class="nome">${item.from}</span> para <span class="destinatario">${item.to}:</span> ${item.text}</li>`
      }

      if(item.type === 'message' && item.to === 'Reservada'){
        chat.innerHTML = chat.innerHTML + `<li class="mensagem reservada"><span class="horario">(${item.time})</span> <span class="nome">${item.from}</span> reservadamente para <span class="destinatario">${item.to}:</span> ${item.text}</li>`
      }
      
    })
  });
}