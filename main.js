// ----------------------------
// Función para tokenizar bien (números completos y operadores)
// ----------------------------
function tokenizar(expresion) {
    // Extrae números enteros/decimales y operadores
    return expresion.match(/\d+(\.\d+)?|[+\-*/^()]/g);
}

// ----------------------------
// Infija -> Postfija (Shunting-yard)
// ----------------------------
function infijaAPostfija(tokens) {
    let salida = [];
    let pila = [];
    let prioridad = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };

    for (let token of tokens) {
        if (!isNaN(token)) {
            salida.push(token);
        } else if (token === "(") {
            pila.push(token);
        } else if (token === ")") {
            while (pila.length && pila[pila.length - 1] !== "(") {
                salida.push(pila.pop());
            }
            pila.pop();
        } else {
            while (
                pila.length &&
                pila[pila.length - 1] !== "(" &&
                prioridad[pila[pila.length - 1]] >= prioridad[token]
            ) {
                salida.push(pila.pop());
            }
            pila.push(token);
        }
    }
    while (pila.length) salida.push(pila.pop());
    return salida;
}

// ----------------------------
// Infija -> Prefija (usando tokens)
// ----------------------------
function infijaAPrefija(expresion) {
    let tokens = tokenizar(expresion);

    // Invertimos los tokens y cambiamos paréntesis
    tokens = tokens.reverse().map(t => {
        if (t === "(") return ")";
        if (t === ")") return "(";
        return t;
    });

    let postfija = infijaAPostfija(tokens);
    return postfija.reverse();
}

// ----------------------------
// Evaluar postfija
// ----------------------------
function evaluarPostfija(tokens) {
    let pila = [];
    for (let token of tokens) {
        if (!isNaN(token)) {
            pila.push(parseFloat(token));
        } else {
            let b = pila.pop();
            let a = pila.pop();
            switch (token) {
                case "+": pila.push(a + b); break;
                case "-": pila.push(a - b); break;
                case "*": pila.push(a * b); break;
                case "/": pila.push(a / b); break;
                case "^": pila.push(Math.pow(a, b)); break;
            }
        }
    }
    return pila[0];
}

// ----------------------------
// Extra: Segmentos numéricos
// ----------------------------
function obtenerSegmentos(expresion) {
    let numeros = expresion.match(/\d+(\.\d+)?/g);
    return numeros || [];
}

// ----------------------------
// Acción botón
// ----------------------------
document.getElementById("btn_generar").addEventListener("click", () => {
    let expresion = document.getElementById("expresion").value.trim();
    let inicio = performance.now();

    try {
        // Tokens
        let tokens = tokenizar(expresion);

        // Representaciones
        let infija = expresion;
        let postfijaArr = infijaAPostfija(tokens);
        let postfija = postfijaArr.join(" ");
        let prefijaArr = infijaAPrefija(expresion);
        let prefija = prefijaArr.join(" ");
        let resultado = evaluarPostfija(postfijaArr);
        let tiempo = (performance.now() - inicio).toFixed(2);

        // Segmentos
        let segmentos = obtenerSegmentos(expresion);

        // Mostrar resultados
        document.getElementById("infija").textContent = infija;
        document.getElementById("prefija").textContent = prefija;
        document.getElementById("postfija").textContent = postfija;
        document.getElementById("resultado").textContent = resultado;
        document.getElementById("tiempo").textContent = tiempo;

        // Segmentos en su propio campo
        let segDiv = document.getElementById("segmentos");
        if (segDiv) {
            segDiv.textContent = segmentos.join(" , ");
        }

    } catch (e) {
        alert("Error en la expresión: " + e.message);
    }
});
