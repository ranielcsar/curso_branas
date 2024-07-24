import { AccountRepository } from "../../infra/repository/AccountRepository"

export class GetAccount {
    constructor(readonly accountRepository: AccountRepository) {}

    async execute(input: { accountId: string }): Promise<any> {
        const account = await this.accountRepository.getAccountById(input.accountId)
        return account
    }
}
