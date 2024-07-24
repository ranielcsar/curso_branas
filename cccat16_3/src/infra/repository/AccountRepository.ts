// interface adapter

import Account from "@/domain/Account"
import DatabaseConnection from "../database/DatabaseConnection"

export interface AccountRepository {
    getAccountByEmail(email: string): Promise<Account | undefined>
    getAccountById(accountId: string): Promise<Account | undefined>
    saveAccount(account: Account): Promise<void>
}

export class AccountRepositoryDb implements AccountRepository {
    constructor(readonly connection: DatabaseConnection) {}

    async getAccountByEmail(email: string): Promise<Account | undefined> {
        const [accountData] = await this.connection.query(
            "SELECT * FROM account WHERE email = $1",
            [email]
        )
        this.connection.close()
        if (!accountData) return

        return Account.restore(
            accountData.account_id,
            accountData.name,
            accountData.email,
            accountData.cpf,
            accountData.car_plate,
            accountData.is_passenger,
            accountData.is_driver
        )
    }

    async getAccountById(accountId: string): Promise<Account | undefined> {
        const [accountData] = await this.connection.query(
            "SELECT * FROM account WHERE account_id = $1",
            [accountId]
        )
        this.connection.close()
        return Account.restore(
            accountData.account_id,
            accountData.name,
            accountData.email,
            accountData.cpf,
            accountData.car_plate,
            accountData.is_passenger,
            accountData.is_driver
        )
    }

    async saveAccount(account: Account): Promise<void> {
        await this.connection.query(
            "INSERT INTO account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [
                account.accountId,
                account.name,
                account.email,
                account.cpf,
                account.carPlate,
                !!account.isPassenger,
                !!account.isDriver,
            ]
        )
        this.connection.close()
    }
}

export class AccountRepositoryMemory implements AccountRepository {
    accounts: any[]

    constructor() {
        this.accounts = []
    }

    async getAccountByEmail(email: string): Promise<any> {
        const account = this.accounts.find((account: any) => account.email === email)
        return account
    }

    async getAccountById(accountId: string): Promise<any> {
        const account = this.accounts.find(
            (account: any) => account.accountId === accountId
        )
        return account
    }

    async saveAccount(account: any): Promise<void> {
        this.accounts.push(account)
    }
}
