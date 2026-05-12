# Parodify Playwright Boilerplate 🚀

Este repositório contém um framework de automação de testes de UI de alto desempenho para a aplicação Parodify. O projeto foi refatorado para seguir as melhores práticas de engenharia de software de 2026, com foco em **velocidade**, **manutenibilidade** e **fiabilidade**.

## 🛠️ Tecnologias Utilizadas

- **Playwright:** Framework core para execução de testes end-to-end.
- **TypeScript:** Tipagem estática para um código mais seguro e autodocumentado.
- **Page Object Model (POM):** Arquitetura para organização de seletores e ações de página.
- **Fixtures:** Injeção de dependências para setup e teardown automatizados.

## 🏗️ Arquitetura e Diferenciais Técnicos

### 1. Page Object Model (POM)
A lógica da interface do utilizador está encapsulada na classe `PlayerPage`. Isto isola os seletores CSS do fluxo de teste. Se a UI mudar, alteramos o código num único local.

### 2. Custom Fixtures
Utilizamos a API `test.extend` do Playwright para injetar automaticamente a `PlayerPage` e configurar o ambiente (como o relógio do sistema) antes de cada teste, removendo código repetitivo (*boilerplate*).

### 3. Network Mocking
Interceptamos as chamadas de API (`**/songs`) para fornecer dados controlados. Isto torna os testes:
- **Independentes do Backend:** Os testes não falham se o servidor estiver em baixo.
- **Determinísticos:** Sabemos exatamente que dados a UI irá processar.

### 4. Clock API (Time Manipulation)
Para testar fluxos que dependem do tempo (como o fim de uma música), utilizamos o `page.clock`. Em vez de esperar 30 segundos reais, avançamos o relógio virtualmente.
- **Velocidade:** Testes que demorariam minutos são executados em milissegundos.

## 🚀 Como Executar

1. Instale as dependências:
   ```bash
   npm install

2. Execute os testes em modo headless:
    ```bash
   npx playwright test

3. Abra o relatório de testes:
    ```bash
    npx playwright show-report

Este projeto reflete a aplicação de padrões avançados de QA Engineering, focado na criação de pipelines de CI/CD rápidos e resilientes.

---

## 🏗️ Estrutura do Projeto

A organização de pastas segue o padrão de escalabilidade para projetos de automação profissional:
```bash
├── fixtures/          # Extensões do Playwright e configurações de ambiente
│   └── base.ts        # Definição de fixtures customizadas (PlayerPage + Clock)
├── pages/             # Implementação do Page Object Model (POM)
│   └── PlayerPage.ts  # Elementos e ações da página do Player
├── tests/             # Cenários de teste automatizados
│   └── example.spec.ts
├── playwright.config.ts
└── package.json