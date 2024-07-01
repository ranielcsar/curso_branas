import { GetAccount } from "@/application/GetAccount"
import { Signup } from "@/application/Signup"
import { AccountDAOMemory, AccountDAODatabase } from "@/resource/AccountDAO"
import { MailerGatewayMemory } from "@/resource/MailerGateway"
import sinon from "sinon"

let signup: Signup
let getAccount: GetAccount

beforeEach(() => {
    // Fake é uma implementação falsa, que mimifica a implementação original
    const accountDAO = new AccountDAOMemory()
    const mailerGateway = new MailerGatewayMemory()
    signup = new Signup(accountDAO, mailerGateway)
    getAccount = new GetAccount(accountDAO)
})

test("Deve criar a conta para o passageiro", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true,
    }
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()
    const outputGetAccount = await getAccount.execute(outputSignup)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
})

test("Deve criar a conta para o motorista", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
        cpf: "87748248800",
        isPassenger: false,
        isDriver: true,
        carPlate: "AAA9999",
    }
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()
    const outputGetAccount = await getAccount.execute(outputSignup)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
})

test("Não deve criar conta para o passageiro caso o email seja inválido", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.floor(Math.random() * 1000)}`,
        cpf: "87748248800",
        isPassenger: true,
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"))
})

test("Não deve criar conta para o passageiro caso o nome seja inválido", async function () {
    const input = {
        name: "John",
        email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true,
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"))
})

test("Não deve criar conta para o passageiro caso o CPF seja inválido", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
        cpf: "877482488",
        isPassenger: true,
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"))
})

test("Não deve criar conta para o passageiro caso a conta já exista", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true,
    }
    await signup.execute(input)
    await expect(() => signup.execute(input)).rejects.toThrow(
        new Error("Account already exists")
    )
})

test("Não deve criar conta para o motorista caso a placa do carro seja inválida", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.floor(Math.random() * 1000)}@gmail.com`,
        cpf: "87748248800",
        isDriver: true,
        carPlate: "AAA999",
    }
    await expect(() => signup.execute(input)).rejects.toThrow(
        new Error("Invalid car plate")
    )
})

// o Stub sobreescreve o método retornando aquilo que você define
test("Deve criar uma conta para o passageiro com Stub", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true,
    }
    const saveAccountStub = sinon
        .stub(AccountDAODatabase.prototype, "saveAccount")
        .resolves()
    const getAccountByEmailStub = sinon
        .stub(AccountDAODatabase.prototype, "getAccountByEmail")
        .resolves()
    const getAccountByIdStub = sinon
        .stub(AccountDAODatabase.prototype, "getAccountById")
        .resolves(input)

    const accountDAO = new AccountDAODatabase()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountDAO, mailerGateway)
    const getAccount = new GetAccount(accountDAO)
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()
    const outputGetAccount = await getAccount.execute(outputSignup)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)

    saveAccountStub.restore()
    getAccountByEmailStub.restore()
    getAccountByIdStub.restore()
})

// Spy registra tudo que acontece no componente espionado pra depois você fazer a verificação que quiser
test("Deve criar uma conta para o passageiro com Spy", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true,
    }
    const sendSpy = sinon.spy(MailerGatewayMemory.prototype, "send")

    const accountDAO = new AccountDAODatabase()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountDAO, mailerGateway)
    const getAccount = new GetAccount(accountDAO)
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()
    const outputGetAccount = await getAccount.execute(outputSignup)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)

    expect(sendSpy.calledOnce).toBe(true)
    expect(sendSpy.calledWith(input.email, "Welcome!", "")).toBe(true)
})

// Mock junta características de Stub e Spy, criando as expectativas no próprio objeto mockado
test("Deve criar uma conta para o passageiro com Mock", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true,
    }
    const sendMock = sinon.mock(MailerGatewayMemory.prototype)
    sendMock
        .expects("send")
        .withArgs(input.email, "Welcome!", "")
        .once()
        .callsFake(() => {})

    const accountDAO = new AccountDAODatabase()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountDAO, mailerGateway)
    const getAccount = new GetAccount(accountDAO)
    const outputSignup = await signup.execute(input)
    expect(outputSignup.accountId).toBeDefined()
    const outputGetAccount = await getAccount.execute(outputSignup)
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)

    sendMock.verify()
    sendMock.restore()
})
