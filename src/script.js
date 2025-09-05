const produtos = [
  { id: 1, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 39.9, cores: ["Branco", "Preto", "Azul"] },
  { id: 2, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 89.9, cores: ["Azul", "Preto"] },
  { id: 3, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 199.9, cores: ["Branco", "Preto"] },
  { id: 4, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 99.9, cores: ["Vermelha", "Preta"] },
  { id: 5, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 29.9, cores: ["Azul", "Preto"] },
  { id: 6, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 159.9, cores: ["Preta", "Cinza"] },
  { id: 7, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 129.9, cores: ["Prata", "Preto"] },
  { id: 8, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 19.9, cores: ["Marrom", "Preto"] },
  { id: 9, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 49.9, cores: ["Preto", "Marrom"] },
  { id: 10, image: ["img/look1.jpg", "img/look2.jpg"], nome: "Conjunto Aura", preco: 14.9, cores: ["Branco", "Preto"] }
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const produtosContainer = document.getElementById("produtos");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalSpan = document.getElementById("total");

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");
    const subtotal = item.qtd * item.preco;
    total += subtotal;
    li.innerHTML = `
      ${item.nome} - Cor: ${item.cor} 
      <input type="number" min="1" value="${item.qtd}" onchange="alterarQtd(${index}, this.value)" />
      <button onclick="removerItem(${index})">Remover</button>
      <br>Subtotal: R$ ${subtotal.toFixed(2)}
    `;
    listaCarrinho.appendChild(li);
  });

  totalSpan.innerText = total.toFixed(2);
  salvarCarrinho();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function alterarQtd(index, novaQtd) {
  novaQtd = parseInt(novaQtd);
  if (novaQtd < 1) return;
  carrinho[index].qtd = novaQtd;
  atualizarCarrinho();
}

function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  const qtd = parseInt(document.getElementById(`qtd-${id}`).value);
  const cor = document.getElementById(`cor-${id}`).value;

  const existente = carrinho.find(item => item.id === id && item.cor === cor);
  if (existente) {
    existente.qtd += qtd;
  } else {
    carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, cor, qtd });
  }

  atualizarCarrinho();
}

function renderizarProdutos() {
  produtos.forEach(produto => {
    const div = document.createElement("div");
    div.className = "produto";
    const opcoesCores = produto.cores.map(cor => `<option value="${cor}">${cor}</option>`).join("");
    div.innerHTML = `
        <div class="carrossel">
        <img src="${produto.image[0]}" class="ativo" style=" width: auto;
    margin: auto;">
        <img src="${produto.image[1]}" class="ativo" style="width: auto;
    margin: auto;">
        <button class="prev">◀</button>
        <button class="next">▶</button>
      </div>
      
      <h3>${produto.nome}</h3>
      <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
      <label>Cor:
        <select id="cor-${produto.id}">${opcoesCores}</select>
      </label><br>
      <label>Qtd:
        <input type="number" id="qtd-${produto.id}" value="1" min="1" />
      </label><br>
      <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao carrinho</button>
    `;
    produtosContainer.appendChild(div);
  });
}

function enviarPedido() {
  const numero = "5511989335794"; // ← Substitua pelo número do lojista

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = "Olá! Quero fazer o seguinte pedido:\n\n";
  carrinho.forEach((item, i) => {
    mensagem += `${i + 1}. ${item.nome} - Cor: ${item.cor} - Qtd: ${item.qtd} - R$ ${(item.preco * item.qtd).toFixed(2)}\n`;
  });
  const total = carrinho.reduce((soma, item) => soma + item.qtd * item.preco, 0);
  mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}


// Inicialização
renderizarProdutos();
atualizarCarrinho();
