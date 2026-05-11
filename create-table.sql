DROP TABLE IF EXISTS flights;

CREATE TABLE flights (
    id BIGSERIAL PRIMARY KEY,
    aircraft TEXT,
    aircrafttype TEXT,
    flight TEXT,
    departureairporticao TEXT,
    arrivalairporticao TEXT,
    coordenada TEXT,
    altitude INTEGER
);

CREATE INDEX idx_flights_aircraft ON flights (aircraft);
CREATE INDEX idx_flights_flight ON flights (flight);
CREATE INDEX idx_flights_departure ON flights (departureairporticao);
CREATE INDEX idx_flights_arrival ON flights (arrivalairporticao);
