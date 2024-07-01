import express from "express"
import { AccountDAODatabase } from "@/resource/AccountDAO"
import { MailerGatewayMemory } from "@/resource/MailerGateway"
import { Signup } from "@/application/Signup"
import { GetAccount } from "@/application/GetAccount"
const app = express()
app.use(express.json())

app.get("/", async function (_, res) {
    return res.send("online!")
})

app.post("/signup", async function (req, res) {
    try {
        const accountDAO = new AccountDAODatabase()
        const mailerGateway = new MailerGatewayMemory()
        const signup = new Signup(accountDAO, mailerGateway)
        const output = await signup.execute(req.body)
        res.json(output)
    } catch (error: any) {
        res.status(422).json({
            message: error.message,
        })
    }
})

app.get("/accounts/:id", async function (req, res) {
    const accountDAO = new AccountDAODatabase()
    const getAccount = new GetAccount(accountDAO)
    const input = {
        accountId: req.params.id,
    }
    const account = await getAccount.execute(input)
    res.json(account)
})

app.listen(3000)
