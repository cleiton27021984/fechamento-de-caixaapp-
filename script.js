let usuarioAtual = "";
let totalDespesas = 0;

// DADOS SALVOS
let dadosSistema = {
    data: "",
    abertura: { dinheiro: 0, moeda: 0, kmInicial: 0 },
    despesas: [],
    fechamento: { uber: 0, app99: 0, particular: 0, dinheiroFinal: 0, moedaFinal: 0, cartao: 0, kmFinal: 0 }
};

/* LOGIN */
function login() {
    const usuario = document.getElementById("usuarioSelect").value;
    const senha = document.getElementById("senha").value;

    if (usuario === "schulz45" && senha === "Dagoberto45.") {
        usuarioAtual = "admin";
        entrarSistema();
    } else if (usuario === "visitante" && senha === "1234") {
        usuarioAtual = "visitante";
        entrarSistema();
        bloquearVisitante();
    } else {
        alert("Senha incorreta!");
    }
}

function entrarSistema() {
    document.querySelector(".tituloPrincipal").style.display = "none";
    document.querySelector(".loginContainer").style.display = "none";
    document.getElementById("sistema").style.display = "block";

    if (usuarioAtual === "admin") {
        carregarDados();
    }
}

function logout() {
    location.reload();
}

/* ADICIONAR DESPESA */
function addDespesa() {
    if (usuarioAtual === "visitante") return;

    const descricao = document.getElementById("descricaoDespesa").value;
    const valor = parseFloat(document.getElementById("valorDespesa").value) || 0;

    if (!descricao || valor <= 0) return alert("Preencha corretamente a despesa.");

    totalDespesas += valor;

    const lista = document.getElementById("listaDespesas");
    const item = document.createElement("li");
    item.innerText = `${descricao} - R$ ${valor.toFixed(2)}`;
    lista.appendChild(item);

    document.getElementById("totalDespesas").innerText = totalDespesas.toFixed(2);

    dadosSistema.despesas.push({ descricao, valor });

    document.getElementById("descricaoDespesa").value = "";
    document.getElementById("valorDespesa").value = "";
}

/* BLOQUEIO VISITANTE */
function bloquearVisitante() {
    const inputs = document.querySelectorAll("#sistema input, #sistema button");
    inputs.forEach(el => el.disabled = true);

    // limpa todos os valores
    document.querySelectorAll("#sistema input").forEach(inp => inp.value = "");
    document.querySelectorAll("#sistema ul li").forEach(li => li.remove());
    document.getElementById("totalDespesas").innerText = "0.00";
    document.getElementById("dataRelatorio").innerText = "---";
    document.getElementById("lucroBruto").innerText = "0.00";
    document.getElementById("lucroLiquido").innerText = "0.00";
    document.getElementById("kmRodado").innerText = "0";
    document.getElementById("mediaKm").innerText = "0.00";
}

/* CALCULAR RESULTADO */
function calcular() {
    if (usuarioAtual === "visitante") return;

    const uber = parseFloat(document.getElementById("uber").value) || 0;
    const app99 = parseFloat(document.getElementById("app99").value) || 0;
    const particular = parseFloat(document.getElementById("particular").value) || 0;

    const kmInicial = parseFloat(document.getElementById("kmInicial").value) || 0;
    const kmFinal = parseFloat(document.getElementById("kmFinal").value) || 0;

    const lucroBruto = uber + app99 + particular;
    const lucroLiquido = lucroBruto - totalDespesas;
    const kmRodado = kmFinal - kmInicial;
    const mediaKm = kmRodado > 0 ? (lucroBruto / kmRodado) : 0;

    const dataDia = document.getElementById("dataInicial").value || "---";

    document.getElementById("dataRelatorio").innerText = dataDia;
    document.getElementById("lucroBruto").innerText = lucroBruto.toFixed(2);
    document.getElementById("lucroLiquido").innerText = lucroLiquido.toFixed(2);
    document.getElementById("kmRodado").innerText = kmRodado;
    document.getElementById("mediaKm").innerText = mediaKm.toFixed(2);

    // Atualiza dadosSistema
    dadosSistema.data = dataDia;
    dadosSistema.abertura = {
        dinheiro: parseFloat(document.getElementById("aberturaDinheiro").value) || 0,
        moeda: parseFloat(document.getElementById("aberturaMoeda").value) || 0,
        kmInicial: kmInicial
    };
    dadosSistema.fechamento = {
        uber,
        app99,
        particular,
        dinheiroFinal: parseFloat(document.getElementById("dinheiroFinal").value) || 0,
        moedaFinal: parseFloat(document.getElementById("moedaFinal").value) || 0,
        cartao: parseFloat(document.getElementById("cartao").value) || 0,
        kmFinal
    };
}

/* SALVAR ABERTURA + DESPESAS */
function salvarAberturaEDespesas() {
    if (usuarioAtual === "visitante") return;

    dadosSistema.data = document.getElementById("dataInicial").value || "";
    dadosSistema.abertura = {
        dinheiro: parseFloat(document.getElementById("aberturaDinheiro").value) || 0,
        moeda: parseFloat(document.getElementById("aberturaMoeda").value) || 0,
        kmInicial: parseFloat(document.getElementById("kmInicial").value) || 0
    };

    const despesasSalvas = JSON.parse(localStorage.getItem("dadosCaixa"))?.despesas || [];
    dadosSistema.despesas = [...despesasSalvas, ...dadosSistema.despesas];

    localStorage.setItem("dadosCaixa", JSON.stringify(dadosSistema));
    alert("✅ Abertura e despesas salvas! Todas as despesas anteriores foram mantidas.");
}

/* SALVAR FECHAMENTO */
function salvarFechamento() {
    if (usuarioAtual === "visitante") return;

    calcular();
    localStorage.setItem("dadosCaixa", JSON.stringify(dadosSistema));
    alert("✅ Fechamento salvo com sucesso!");
}

/* CARREGAR DADOS */
function carregarDados() {
    if (usuarioAtual === "visitante") return;

    const dadosSalvos = JSON.parse(localStorage.getItem("dadosCaixa"));
    if (!dadosSalvos) return;

    dadosSistema = dadosSalvos;

    // Data e abertura
    document.getElementById("dataInicial").value = dadosSistema.data;
    document.getElementById("aberturaDinheiro").value = dadosSistema.abertura.dinheiro;
    document.getElementById("aberturaMoeda").value = dadosSistema.abertura.moeda;
    document.getElementById("kmInicial").value = dadosSistema.abertura.kmInicial;

    // Fechamento
    document.getElementById("uber").value = dadosSistema.fechamento.uber;
    document.getElementById("app99").value = dadosSistema.fechamento.app99;
    document.getElementById("particular").value = dadosSistema.fechamento.particular;
    document.getElementById("dinheiroFinal").value = dadosSistema.fechamento.dinheiroFinal;
    document.getElementById("moedaFinal").value = dadosSistema.fechamento.moedaFinal;
    document.getElementById("cartao").value = dadosSistema.fechamento.cartao;
    document.getElementById("kmFinal").value = dadosSistema.fechamento.kmFinal;

    // Despesas
    const lista = document.getElementById("listaDespesas");
    lista.innerHTML = "";
    totalDespesas = 0;
    dadosSistema.despesas.forEach(d => {
        const item = document.createElement("li");
        item.innerText = `${d.descricao} - R$ ${d.valor.toFixed(2)}`;
        lista.appendChild(item);
        totalDespesas += d.valor;
    });

    document.getElementById("totalDespesas").innerText = totalDespesas.toFixed(2);

    calcular();
}