import pgp from "pg-promise"
import { Account } from "@/types/account"

// Driven/Resource Port
export interface AccountDAO {
    getAccountByEmail(email: string): Promise<Account>
    getAccountById(id: string): Promise<Account>
    saveAccount(account: Account): Promise<string>
}

// Driven/Resource Adapter
export class AccountDAODatabase implements AccountDAO {
    async getAccountByEmail(email: string): Promise<Account> {
        const connection = pgp()("postgres://postgres:ride123@localhost:5432/ride")
        const [acc] = await connection.query("SELECT * FROM account WHERE email = $1", [
            email,
        ])
        await connection.$pool.end()
        return acc
    }

    async getAccountById(id: string): Promise<Account> {
        const connection = pgp()("postgres://postgres:ride123@localhost:5432/ride")
        const [acc] = await connection.query(
            "SELECT * FROM account WHERE account_id = $1",
            [id]
        )
        await connection.$pool.end()
        return acc
    }

    async saveAccount(account: Account): Promise<string> {
        const connection = pgp()("postgres://postgres:ride123@localhost:5432/ride")
        await connection.query(
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
        await connection.$pool.end()
        return "Account created"
    }
}

// Driven/Resource Adapter
export class AccountDAOMemory implements AccountDAO {
    accounts: Account[]

    constructor() {
        this.accounts = []
    }

    async getAccountByEmail(email: string): Promise<Account> {
        const account = this.accounts.find((account: Account) => account.email === email)
        return account as Account
    }

    async getAccountById(accountId: string): Promise<Account> {
        const account = this.accounts.find(
            (account: Account) => account.accountId === accountId
        )
        return account as Account
    }

    async saveAccount(account: Account): Promise<string> {
        this.accounts.push(account)
        return "Account created"
    }
}
