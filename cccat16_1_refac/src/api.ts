import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
const app = express();
app.use(express.json());

app.get("/", async function (_, res) {
  return res.send("online!");
});

app.post("/signup", async function (req, res) {
  const connection = pgp()("postgres://postgres:ride123@localhost:5432/ride");

  const isValidName = (name: string) => name.match(/[a-zA-Z] [a-zA-Z]+/);
  const isValidEmail = (email: string) => email.match(/^(.+)@(.+)$/);

  try {
    const [acc] = await connection.query(
      "SELECT * FROM account WHERE email = $1",
      [req.body.email]
    );
    if (acc) {
      return res.status(409).send({ message: "Usuário já existe" });
    }
    if (!isValidName(req.body.name)) {
      return res.status(409).send({ message: "Nome inválido" });
    }
    if (!isValidEmail(req.body.email)) {
      return res.status(409).send({ message: "Email inválido" });
    }
    if (!validate(req.body.cpf)) {
      return res.status(409).send({ message: "CPF inválido" });
    }

    const id = crypto.randomUUID();
    if (req.body.isDriver) {
      if (!req.body.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
        return res.status(409).send({ message: "Placa inválida" });
      }
    }
    await connection.query(
      "INSERT INTO account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        id,
        req.body.name,
        req.body.email,
        req.body.cpf,
        req.body.carPlate,
        !!req.body.isPassenger,
        !!req.body.isDriver,
      ]
    );
    res.json({
      accountId: id,
    });
  } finally {
    await connection.$pool.end();
  }
});

app.get("/accounts", async function (_, res) {
  const connection = pgp()("postgres://postgres:ride123@localhost:5432/ride");
  const accounts = await connection.query("SELECT * FROM account");
  return res.send({ accounts });
});

app.delete("/account/:id", async function (req, res) {
  const connection = pgp()("postgres://postgres:ride123@localhost:5432/ride");
  await connection.query("DELETE FROM account WHERE account_id = $1", [
    req.params.id,
  ]);
  return res.status(200).send({ message: "Account deleted" });
});

app.listen(3000);
