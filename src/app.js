import "dotenv/config"
import express from "express"
import cors from "cors"
import flightsRoutes from "./flights.routes.js"

const app = express()
const frontendOrigin = process.env.FRONTEND_ORIGIN || "*"

app.use(cors({
  origin: frontendOrigin === "*" ? true : frontendOrigin,
  credentials: true
}))

app.get("/", (req, res) => {
  res.json({
    name: "SITA Points API",
    status: "online"
  })
})

app.use("/api", flightsRoutes)

app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada"
  })
})

export default app
