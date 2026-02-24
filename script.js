let usuarioAtual = "";
let totalDespesas = 0;

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
}

function logout() {
    location.reload();
}

/* DESPESAS */
function addDespesa() {
    const descricao = document.getElementById("descricaoDespesa").value;
    const valor = parseFloat(document.getElementById("valorDespesa").value) || 0;

    totalDespesas += valor;

    const lista = document.getElementById("listaDespesas");
    const item = document.createElement("li");
    item.innerText = `${descricao} - R$ ${valor.toFixed(2)}`;
    lista.appendChild(item);

    document.getElementById("totalDespesas").innerText = totalDespesas.toFixed(2);

    document.getElementById("descricaoDespesa").value = "";
    document.getElementById("valorDespesa").value = "";
}

/* BLOQUEIO VISITANTE */
function bloquearVisitante() {
    const inputs = document.querySelectorAll("#sistema input, #sistema button");
    inputs.forEach(el => el.disabled = true);
}

/* CALCULAR RESULTADO */
function calcular() {
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
}