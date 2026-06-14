# SI - Soluções Imobiliárias (Frontend)

Este é o repositório Frontend do CRM **SI - Soluções Imobiliárias**, uma aplicação web moderna projetada para corretores e gestores imobiliários. A interface foca em produtividade, organização visual e uso de Inteligência Artificial para facilitar o fechamento de negócios.

## Tecnologias Utilizadas

* **Framework:** Next.js (App Router) & React
* **Estilização:** Tailwind CSS (com suporte nativo a Dark/Light Mode)
* **Gráficos e Métricas:** Recharts
* **Comunicação de API:** Axios (com interceptors para injeção de JWT)
* **Ícones:** Lucide React
* **Formatador Markdown:** React Markdown (para renderização inteligente das respostas da IA)

## Funcionalidades Principais

* **Landing Page de Alta Conversão:** Interface moderna para recepção e direcionamento de usuários.
* **Dashboard de Métricas:** Painel visual com gráficos (Recharts) que refletem o status atual do banco de dados (Total de leads, divisão por status e prioridade).
* **Kanban Dinâmico:** Gerenciamento visual de leads com funcionalidade Drag-and-Drop (Arraste e Solte) para atualização de status em tempo real.
* **Gestão Completa do Lead:** Upload de arquivos (anexos), histórico temporal de interações/notas e categorização por prioridade e perfil do imóvel.
* **SIA (Assistente Virtual AI):** Chatbot flutuante integrado com o banco de dados da aplicação, capaz de analisar os leads atuais e gerar e-mails ou resumos de forma contextualizada usando IA.

## Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone <url-deste-repositorio>
    cd si-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração de Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione a URL do backend:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  Acesse `http://localhost:3000` no seu navegador.

---
*Desenvolvido por Wesley - Desenvolvedor Full Stack*