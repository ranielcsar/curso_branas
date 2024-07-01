import { AccountDAO } from "@/resource/AccountDAO"
import { Account } from "@/types/account"

export class GetAccount {
    constructor(readonly accountDAO: AccountDAO) {}

    async execute(input: { accountId: string }): Promise<Account> {
        const account = await this.accountDAO.getAccountById(input.accountId)
        return account
    }
}
