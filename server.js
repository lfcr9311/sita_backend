import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const PORT = Number(process.env.PORT || 8000)

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://sita-backend.vercel.app",
  process.env.FRONTEND_ORIGIN
].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS bloqueado para origem: ${origin}`))
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
)

app.options("*", cors())

app.use(express.json({ limit: "10mb" }))

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "sita-backend"
  })
})

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true
  })
})

app.get("/api/flights", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50000)

    res.json({
      data: [],
      limit
    })
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar voos"
    })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})