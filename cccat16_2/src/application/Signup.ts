import crypto from "crypto"
import { AccountDAO } from "@/resource/AccountDAO"
import { MailerGateway } from "@/resource/MailerGateway"
import { validateCpf } from "./validateCpf"
import { Account } from "@/types/account"

export class Signup {
    constructor(readonly accountDAO: AccountDAO, readonly mailerGateway: MailerGateway) {}

    async execute(input: Account): Promise<{ accountId: string }> {
        const account = input
        account.accountId = crypto.randomUUID()
        const existingAccount = await this.accountDAO.getAccountByEmail(account.email)
        const isValidName = (name: string) => name.match(/[a-zA-Z] [a-zA-Z]+/)
        const isValidEmail = (email: string) => email.match(/^(.+)@(.+)$/)
        const isValidCarPlate = (carPlate: string) => carPlate.match(/[A-Z]{3}[0-9]{4}/)

        if (existingAccount) throw new Error("Account already exists")
        if (!isValidName(account.name)) throw new Error("Invalid name")
        if (!isValidEmail(account.email)) throw new Error("Invalid email")
        if (!validateCpf(account.cpf)) throw new Error("Invalid cpf")
        if (account.isDriver && account.carPlate && !isValidCarPlate(account.carPlate))
            throw new Error("Invalid car plate")

        await this.accountDAO.saveAccount(account)
        await this.mailerGateway.send(account.email, "Welcome!", "")
        return {
            accountId: account.accountId,
        }
    }
}
