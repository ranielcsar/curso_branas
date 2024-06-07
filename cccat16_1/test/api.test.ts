import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

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
});

test("Deve retornar -1 caso CPF seja inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
    cpf: "12312312312",
    isPassenger: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(422);
  expect(output.data).toBe(-1);
});

test("Deve retornar -2 caso Email seja inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doegmail.com`,
    cpf: "12312312312",
    isPassenger: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(422);
  expect(output.data).toBe(-2);
});

test("Deve retornar -3 caso Nome seja inválido", async function () {
  const input = {
    name: "123Johes",
    email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
    cpf: "12312312312",
    isPassenger: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(422);
  expect(output.data).toBe(-3);
});

test("Deve retornar -4 ao criar conta existente", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe827@gmail.com`,
    cpf: "87748248800",
    isPassenger: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(422);
  expect(output.data).toBe(-4);
});
