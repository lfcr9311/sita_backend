import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import flightsRoutes from "./flights.routes.js"

dotenv.config()

const app = express()

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
)

app.options("*", cors())

app.use(express.json())

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "sita-backend"
  })
})

app.use("/api", flightsRoutes)

app.use((error, _req, res, _next) => {
  res.status(500).json({
    error: "Erro interno no servidor",
    message: error.message
  })
})

export default app