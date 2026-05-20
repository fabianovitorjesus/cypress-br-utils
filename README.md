# cypress-br-utils

Utilitários JavaScript para geração de documentos brasileiros válidos em testes automatizados com Cypress.

## Por que isso existe?

Hardcodar CPF, CNPJ ou CNH nos testes é um erro clássico. O documento fixo pode:

- Já existir no banco de dados e causar erro de duplicidade
- Ser bloqueado em ambientes de staging
- Criar dependência entre testes que deveriam ser independentes

Este pacote gera documentos **matematicamente válidos** a cada execução, usando os algoritmos oficiais de cada órgão (Receita Federal e DENATRAN).

---

## Geradores disponíveis

| Função | Documento | Algoritmo |
|---|---|---|
| `generateCNPJ()` | CNPJ | Módulo 11 — Receita Federal |
| `generateCPF()` | CPF | Módulo 11 — Receita Federal |
| `generateCNH()` | CNH | DENATRAN (com ajuste do DV2) |

---

## Como usar

Copie a pasta `src/` para dentro do seu projeto Cypress, em `cypress/support/utils/` por exemplo.

```js
import { generateCNPJ } from './utils/cnpjGenerator.js';
import { generateCPF }  from './utils/cpfGenerator.js';
import { generateCNH }  from './utils/cnhGenerator.js';
```

### CNPJ

```js
generateCNPJ()                     // "12.345.678/0001-90"
generateCNPJ({ formatted: false }) // "12345678000190"
```

### CPF

```js
generateCPF()                     // "123.456.789-09"
generateCPF({ formatted: false }) // "12345678909"
```

### CNH

```js
generateCNH() // "12345678900"  (CNH não tem máscara oficial)
```

---

## Exemplo completo no Cypress

```js
import { generateCPF } from './utils/cpfGenerator.js';
import { generateCNH } from './utils/cnhGenerator.js';

it('deve cadastrar um novo condutor', () => {
  const cpf = generateCPF();
  const cnh = generateCNH();

  cy.visit('/condutores/novo');
  cy.get('[data-test="input-cpf"]').type(cpf);
  cy.get('[data-test="input-cnh"]').type(cnh);
  cy.get('[data-test="btn-salvar"]').click();
  cy.get('[data-test="msg-sucesso"]').should('be.visible');
});
```

---

## Estrutura do projeto

```
cypress-br-utils/
├── src/
│   ├── index.js          # exporta tudo
│   ├── cnpjGenerator.js
│   ├── cpfGenerator.js
│   ├── cnhGenerator.js
│   └── utils.js          # função randInt compartilhada
└── examples/
    └── cypress-usage.js  # exemplos de uso
```

---

## Detalhes dos algoritmos

### CNPJ e CPF — Módulo 11
Ambos usam o algoritmo Módulo 11 da Receita Federal: multiplica cada dígito da base por um peso específico, soma os resultados, divide por 11 e aplica uma regra sobre o resto para chegar no dígito verificador.

### CNH — DENATRAN
O algoritmo da CNH tem uma particularidade importante: se o primeiro dígito verificador for maior ou igual a 10, ele vira 0 **e** um ajuste de -2 é aplicado no cálculo do segundo dígito. Esse detalhe é ignorado em muitas implementações encontradas na internet, gerando CNHs inválidas silenciosamente.

---

## Contribuindo

Pull requests são bem-vindos. Se você trabalha com outros documentos do contexto brasileiro (Renavam, placa de veículo, inscrição estadual), fique à vontade para abrir uma issue ou PR.

---

## Licença

MIT
