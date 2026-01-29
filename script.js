let carrinho = [];
let desconto = 0;
const CUPONS_VALIDOS = {
    "DOCE10": 0.10, // 10% de desconto
    "BEMVINDO": 5   // $5 fixos de desconto
};

function adicionar(nome, preco) {
    const item = carrinho.find(i => i.nome === nome);
    if (item) { item.quantidade++; }
    else { carrinho.push({ nome, preco, quantidade: 1 }); }
    atualizarUI();
}

function aplicarCupom() {
    const code = document.getElementById('coupon-input').value.toUpperCase();
    const msg = document.getElementById('coupon-msg');
    
    if (CUPONS_VALIDOS[code]) {
        desconto = CUPONS_VALIDOS[code];
        msg.innerText = "Cupom aplicado!";
        msg.className = "success";
    } else {
        desconto = 0;
        msg.innerText = "Cupom inválido.";
        msg.className = "error";
    }
    atualizarUI();
}
function remover(nome) {

    const index = carrinho.findIndex(i => i.nome === nome);

    if (index !== -1) {

        if (carrinho[index].quantidade > 1) { carrinho[index].quantidade--; }

        else { carrinho.splice(index, 1); }

    }
}



function atualizarUI() {
    const listHtml = document.getElementById('cart-list');
    const subtotalDisplay = document.getElementById('subtotal-price');
    const totalDisplay = document.getElementById('total-price');
    const discountRow = document.getElementById('discount-row');
    const discountDisplay = document.getElementById('discount-val');

    listHtml.innerHTML = "";
    let subtotal = 0;

    carrinho.forEach(item => {
        subtotal += (item.preco * item.quantidade);
        listHtml.innerHTML += `
            <div class="cart-item-row">
                <div style="text-align: left">
                    <div style="font-weight:900; color:#5e17eb">${item.nome}</div>
                    <div style="font-size:0.7rem">$${item.preco} cada</div>
                </div>
                <div class="btns">
                    <button onclick="remover('${item.nome}')">-</button>
                    <span style="font-weight:900; margin:0 5px">${item.quantidade}</span>
                    <button class="plus" onclick="adicionar('${item.nome}', ${item.preco})">+</button>
                </div>
            </div>`;
    });

    // Cálculo do Desconto
    let valorDesconto = (desconto < 1) ? (subtotal * desconto) : desconto;
    if (subtotal === 0) valorDesconto = 0;
    
    let totalFinal = subtotal - valorDesconto;

    subtotalDisplay.innerText = `$ ${subtotal}`;
    
    if (valorDesconto > 0) {
        discountRow.style.display = "flex";
        discountDisplay.innerText = `-$ ${valorDesconto.toFixed(2)}`;
    } else {
        discountRow.style.display = "none";
    }

    totalDisplay.innerText = `$ ${totalFinal.toFixed(2)}`;
    if(document.getElementById('final-price')) {
        document.getElementById('final-price').innerText = `$ ${totalFinal.toFixed(2)}`;
    }
}
function mudarTela(id) {

    if (id === 'screen-payment' && carrinho.length === 0) return alert("Seu carrinho está vazio!");

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

    document.getElementById(id).classList.remove('hidden');

    window.scrollTo(0,0);

}
function finalizarPedido() {
    // 1. Captura os valores dos novos campos
    const nome = document.getElementById('cust-name').value;
    const endereco = document.getElementById('cust-address').value;
    const bairro = document.getElementById('cust-city').value;
    const obs = document.getElementById('cust-obs').value; // Observação
    const metodo = document.getElementById('pay-method').value;
    const total = document.getElementById('total-price').innerText;

    // 2. Validação básica
    if (!nome || !endereco) {
        alert("Ops! Precisamos do seu nome e endereço para a entrega.");
        return;
    }

    // 3. Monta a mensagem para o WhatsApp
    let itensPedido = "";
    carrinho.forEach(item => {
        itensPedido += `*${item.quantidade}x* ${item.nome} - $${(item.preco * item.quantidade).toFixed(2)}%0A`;
    });

    const msgZap = `*NOVO PEDIDO - Sweet Dreams*%0A%0A` +
                   `*CLIENTE:* ${nome}%0A` +
                   `*ENDEREÇO:* ${endereco}, ${bairro}%0A` +
                   `*OBSERVAÇÕES:* ${obs || "Nenhuma"}%0A` + // Envia a observação
                   `*PAGAMENTO:* ${metodo}%0A%0A` +
                   `*ITENS:*%0A${itensPedido}%0A` +
                   `*TOTAL: ${total}*`;

    // 4. Abre o WhatsApp (Troque pelo seu número com DDD)
    window.open(`https://wa.me/5511999999999?text=${msgZap}`, '_blank');

    // 5. Atualiza o recibo na tela final e muda de tela
    document.getElementById('receipt-customer-info').innerHTML = `
        <b>CLIENTE:</b> ${nome}<br>
        <b>ENTREGA:</b> ${endereco} - ${bairro}<br>
        <b>OBS:</b> ${obs || "Nenhuma"}
    `;
    
    mudarTela('screen-thanks');
}

function enviarWhatsApp() {
    const nome = document.getElementById('cust-name').value;
    const endereco = document.getElementById('cust-address').value;
    const bairro = document.getElementById('cust-city').value;
    const metodo = document.getElementById('pay-method').value;
    const total = document.getElementById('total-price').innerText;

    let mensagem = `*Novo Pedido - Sweet Dreams*%0A%0A`;
    mensagem += `*Cliente:* ${nome}%0A`;
    mensagem += `*Endereço:* ${endereco}, ${bairro}%0A`;
    mensagem += `*Pagamento:* ${metodo}%0A%0A`;
    mensagem += `*Itens:*%0A`;
    
    carrinho.forEach(item => {
        mensagem += `- ${item.quantidade}x ${item.nome} ($${item.preco * item.quantidade})%0A`;
    });

    mensagem += `%0A*TOTAL: ${total}*`;

    const telefone = "5511999999999"; // COLOQUE SEU NÚMERO AQUI (com DDD)
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
}




