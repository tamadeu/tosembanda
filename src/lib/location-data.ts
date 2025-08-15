export interface City {
  nome: string;
}

export interface State {
  sigla: string;
  nome: string;
  cidades: City[];
}

// NOTA: Esta é uma lista simplificada para fins de demonstração.
export const states: State[] = [
  {
    sigla: "SP",
    nome: "São Paulo",
    cidades: [
      { nome: "São Paulo" },
      { nome: "Campinas" },
      { nome: "Guarulhos" },
      { nome: "Santos" },
    ],
  },
  {
    sigla: "RJ",
    nome: "Rio de Janeiro",
    cidades: [
      { nome: "Rio de Janeiro" },
      { nome: "Niterói" },
      { nome: "Duque de Caxias" },
      { nome: "Nova Iguaçu" },
    ],
  },
  {
    sigla: "MG",
    nome: "Minas Gerais",
    cidades: [
      { nome: "Belo Horizonte" },
      { nome: "Uberlândia" },
      { nome: "Contagem" },
      { nome: "Juiz de Fora" },
    ],
  },
  {
    sigla: "PR",
    nome: "Paraná",
    cidades: [
      { nome: "Curitiba" },
      { nome: "Londrina" },
      { nome: "Maringá" },
      { nome: "Ponta Grossa" },
    ],
  },
];