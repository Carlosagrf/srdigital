// Lista resumida para exemplo. Adicione mais cidades conforme necessário.
const estadosCidades = {
  AC: { nome: 'Acre', cidades: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'] },
  AL: { nome: 'Alagoas', cidades: ['Maceió', 'Arapiraca', 'Palmeira dos Índios'] },
  AM: { nome: 'Amazonas', cidades: ['Manaus', 'Parintins', 'Itacoatiara'] },
  AP: { nome: 'Amapá', cidades: ['Macapá', 'Santana', 'Laranjal do Jari'] },
  BA: { nome: 'Bahia', cidades: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'] },
  CE: { nome: 'Ceará', cidades: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'] },
  DF: { nome: 'Distrito Federal', cidades: ['Brasília'] },
  ES: { nome: 'Espírito Santo', cidades: ['Vitória', 'Vila Velha', 'Serra'] },
  GO: { nome: 'Goiás', cidades: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis'] },
  MA: { nome: 'Maranhão', cidades: ['São Luís', 'Imperatriz', 'Timon'] },
  MG: { nome: 'Minas Gerais', cidades: ['Belo Horizonte', 'Uberlândia', 'Contagem'] },
  MS: { nome: 'Mato Grosso do Sul', cidades: ['Campo Grande', 'Dourados', 'Três Lagoas'] },
  MT: { nome: 'Mato Grosso', cidades: ['Cuiabá', 'Várzea Grande', 'Rondonópolis'] },
  PA: { nome: 'Pará', cidades: ['Belém', 'Ananindeua', 'Santarém'] },
  PB: { nome: 'Paraíba', cidades: ['João Pessoa', 'Campina Grande', 'Santa Rita'] },
  PE: { nome: 'Pernambuco', cidades: ['Recife', 'Jaboatão dos Guararapes', 'Olinda'] },
  PI: { nome: 'Piauí', cidades: ['Teresina', 'Parnaíba', 'Picos'] },
  PR: { nome: 'Paraná', cidades: ['Curitiba', 'Londrina', 'Maringá'] },
  RJ: { nome: 'Rio de Janeiro', cidades: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias'] },
  RN: { nome: 'Rio Grande do Norte', cidades: ['Natal', 'Mossoró', 'Parnamirim'] },
  RO: { nome: 'Rondônia', cidades: ['Porto Velho', 'Ji-Paraná', 'Ariquemes'] },
  RR: { nome: 'Roraima', cidades: ['Boa Vista', 'Rorainópolis', 'Caracaraí'] },
  RS: { nome: 'Rio Grande do Sul', cidades: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'] },
  SC: { nome: 'Santa Catarina', cidades: ['Florianópolis', 'Joinville', 'Blumenau'] },
  SE: { nome: 'Sergipe', cidades: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto'] },
  SP: { nome: 'São Paulo', cidades: ['São Paulo', 'Guarulhos', 'Campinas'] },
  TO: { nome: 'Tocantins', cidades: ['Palmas', 'Araguaína', 'Gurupi'] },
};

// Para facilitar o map, exportar um objeto onde cada sigla aponta para { nome, cidades: [] }
const estadosCidadesMap = {};
for (const sigla in estadosCidades) {
  estadosCidadesMap[sigla] = {
    nome: estadosCidades[sigla].nome,
    cidades: estadosCidades[sigla].cidades,
  };
}

export default estadosCidadesMap; 