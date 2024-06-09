import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

let accountId: string | null = null;

test("Deve criar uma conta para o passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(200);
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  expect(output.data).toStrictEqual({
    accountId: expect.stringMatching(uuidRegex),
  });
  accountId = output.data.accountId;
});

test("Deve retornar mensagem de erro caso CPF seja inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
    cpf: "12312312312",
    isPassenger: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(409);
  expect(output.data).toStrictEqual({ message: "CPF inválido" });
});

test("Deve retornar mensagem de erro caso Email seja inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doegmail.com`,
    cpf: "12312312312",
    isPassenger: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(409);
  expect(output.data).toStrictEqual({ message: "Email inválido" });
});

test("Deve retornar mensagem de erro caso Nome seja inválido", async function () {
  const input = {
    name: "123Johes",
    email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
    cpf: "12312312312",
    isPassenger: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(409);
  expect(output.data).toStrictEqual({ message: "Nome inválido" });
});

test("Deve retornar messagem de erro ao criar conta existente", async function () {
  const input = {
    name: "John Doe",
    email: `noob@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(409);
  expect(output.data).toStrictEqual({ message: "Usuário já existe" });
});

test("Deve deletar uma conta", async function () {
  const result = await axios.delete(
    `http://localhost:3000/account/${accountId}`
  );
  expect(result.status).toBe(200);
  expect(result.data).toStrictEqual({
    message: "Account deleted",
  });
});
