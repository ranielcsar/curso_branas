import axios from "axios"

axios.defaults.validateStatus = function () {
    return true
}

let accountId: string | null = null

test("Deve criar uma conta para o passageiro", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true,
    }
    const output = await axios.post("http://localhost:3000/signup", input)
    expect(output.status).toBe(200)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(output.data).toStrictEqual({
        accountId: expect.stringMatching(uuidRegex),
    })
    accountId = output.data.accountId
    const responseGetAccount = await axios.get(
        `http://localhost:3000/accounts/${accountId}`
    )
    const outputGetAccount = responseGetAccount.data
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
})

test("Não deve criar uma conta para o passageiro se o nome for inválido", async function () {
    const input = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true,
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", input)
    expect(responseSignup.status).toBe(422)
    const outputSignup = responseSignup.data
    expect(outputSignup.message).toBe("Invalid name")
})

// test("Deve retornar mensagem de erro caso CPF seja inválido", async function () {
//     const input = {
//         name: "John Doe",
//         email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
//         cpf: "12312312312",
//         isPassenger: true,
//     }
//     const output = await axios.post("http://localhost:3000/signup", input)
//     expect(output.status).toBe(422)
//     expect(output.data).toStrictEqual({ message: "CPF inválido" })
// })

// test("Deve retornar mensagem de erro caso Email seja inválido", async function () {
//     const input = {
//         name: "John Doe",
//         email: `john.doegmail.com`,
//         cpf: "12312312312",
//         isPassenger: true,
//     }
//     const output = await axios.post("http://localhost:3000/signup", input)
//     expect(output.status).toBe(422)
//     expect(output.data).toStrictEqual({ message: "Email inválido" })
// })

// test("Deve retornar mensagem de erro caso Nome seja inválido", async function () {
//     const input = {
//         name: "123Johes",
//         email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
//         cpf: "12312312312",
//         isPassenger: true,
//     }
//     const output = await axios.post("http://localhost:3000/signup", input)
//     expect(output.status).toBe(422)
//     expect(output.data).toStrictEqual({ message: "Nome inválido" })
// })

// test("Deve retornar messagem de erro ao criar conta existente", async function () {
//     const input = {
//         name: "John Doe",
//         email: `noob@gmail.com`,
//         cpf: "87748248800",
//         isPassenger: true,
//     }
//     const output = await axios.post("http://localhost:3000/signup", input)
//     expect(output.status).toBe(422)
//     expect(output.data).toStrictEqual({ message: "Usuário já existe" })
// })

// test("Deve retornar messagem de erro ao ter placa inválida", async function () {
//     const input = {
//         name: "John Doe",
//         email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
//         cpf: "87748248800",
//         isDriver: true,
//         carPlate: "1231231",
//     }
//     const output = await axios.post("http://localhost:3000/signup", input)
//     expect(output.status).toBe(422)
//     expect(output.data).toStrictEqual({ message: "Placa inválida" })
// })
