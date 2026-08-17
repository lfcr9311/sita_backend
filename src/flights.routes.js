import express from "express"
import { pool } from "./db.js"
import { buildFlightPoint } from "./normalize.js"

const router = express.Router()

router.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1 AS ok")

    res.json({
      status: "ok",
      database: result.rows[0].ok === 1 ? "connected" : "unknown"
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    })
  }
})

router.get("/rotas", async (req, res) => {
  const sql = `
    SELECT DISTINCT
      departureairporticao AS origem,
      arrivalairporticao AS destino
    FROM flights
    WHERE departureairporticao IS NOT NULL
      AND arrivalairporticao IS NOT NULL
      AND departureairporticao <> ''
      AND arrivalairporticao <> ''
    ORDER BY origem, destino
  `

  try {
    const result = await pool.query(sql)

    res.json({
      total: result.rows.length,
      data: result.rows
    })
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar rotas",
      message: error.message
    })
  }
})

router.get("/flights", async (req, res) => {
  const { flight, aircraft, origem, destino } = req.query

  const where = ["coordenada IS NOT NULL"]
  const values = []

  if (flight) {
    values.push(`%${String(flight).trim()}%`)
    where.push(`flight ILIKE $${values.length}`)
  }

  if (aircraft) {
    values.push(`%${String(aircraft).trim()}%`)
    where.push(`aircraft ILIKE $${values.length}`)
  }

  if (origem) {
    values.push(`%${String(origem).trim()}%`)
    where.push(`departureairporticao ILIKE $${values.length}`)
  }

  if (destino) {
    values.push(`%${String(destino).trim()}%`)
    where.push(`arrivalairporticao ILIKE $${values.length}`)
  }

  const sql = `
    SELECT
      aircraft,
      aircrafttype,
      flight,
      departureairporticao,
      arrivalairporticao,
      coordenada,
      altitude
    FROM flights
    WHERE ${where.join(" AND ")}
    ORDER BY aircraft, flight
  `

  try {
    const result = await pool.query(sql, values)

    const data = result.rows
      .map(buildFlightPoint)
      .filter(Boolean)

    res.json({
      total: data.length,
      data
    })
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar voos",
      message: error.message
    })
  }
})

export default router