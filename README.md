# 💰 Financial Management API

API RESTful para gerenciamento de finanças pessoais ou corporativas, construída com foco em escalabilidade, segurança e manutenibilidade.

---

## 🧠 Descrição

Esta API foi desenvolvida com **TypeScript**, **NestJS** e **Node.js**, seguindo os princípios da **Clean Architecture**, **SOLID** e **Domain-Driven Design (DDD)**.  
Conta com:

- Autenticação segura via **JWT**
- Banco de dados gerenciado com **Prisma ORM**
- Integração com **Stripe** para pagamentos
- Funcionalidades inteligentes utilizando a **OpenAI API**

---

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [JWT](https://jwt.io/)
- [Stripe API](https://stripe.com/)
- [OpenAI API](https://platform.openai.com/)
- Clean Architecture + SOLID + DDD

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/ayranoliveira1/finance-api.git
cd nome-do-repo

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais (banco de dados, JWT, Stripe, OpenAI)

#Iniciar Docker
docker compose up -d

# Execute as migrations do Prisma
pnpm prisma migrate dev

# Inicie o servidor
pnpm start:dev
```

---

## 📫 Endpoints

A documentação completa está disponível via Swagger em:

```
http://localhost:3001/api
```

---

## 🧪 Testes

```bash
# Execute os testes unitários
pnpm test
```

---

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 🤝 Contribuição

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir _issues_, enviar _pull requests_ ou sugerir melhorias.
