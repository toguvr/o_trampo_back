export function montarBaralho(jogadores) {
  const cartas = ['Duque', 'Capitão', 'Assassino', 'Condessa', 'Embaixador'];
  const baralho = [];
  if (jogadores >= 3 && jogadores <= 6) {
    cartas.map((carta, index) => {
      let i = 0;
      while (i < 3) {
        baralho.push({ id: index + i + 1, carta });
        i++;
      }

      return baralho;
    });
  } else if (jogadores === 7 || jogadores === 8) {
    cartas.map((carta, index) => {
      let i = 0;
      while (i < 4) {
        baralho.push({ id: index + i + 1, carta });
        i++;
      }

      return baralho;
    });
  } else if (jogadores === 9 || jogadores === 10) {
    cartas.map((carta, index) => {
      let i = 0;
      while (i < 5) {
        baralho.push({ id: index + i + 1, carta });
        i++;
      }

      return baralho;
    });
  } else {
    return baralho;
  }

  return baralho;
}

export function embaralhar(cartasParaEmbaralhar) {
  for (
    let j, x, i = cartasParaEmbaralhar.length;
    i;
    j = Math.floor(Math.random() * i),
      x = cartasParaEmbaralhar[--i],
      cartasParaEmbaralhar[i] = cartasParaEmbaralhar[j],
      cartasParaEmbaralhar[j] = x
  );
  return cartasParaEmbaralhar;
}

export function comprar(baralhoAtual, qtd) {
  return baralhoAtual.slice(0, qtd);
}

export function devolver(baralhoAtual, cartaParaDevolver) {
  return baralhoAtual.push(cartaParaDevolver);
}
