CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  language TEXT DEFAULT 'English',
  role TEXT NOT NULL CHECK (role IN ('patient', 'chw', 'doctor')),
  location TEXT,
  specialisation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE symptoms (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES users(id),
  logged_by INT NOT NULL REFERENCES users(id),
  description TEXT NOT NULL,
  urgency_level TEXT DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES users(id),
  doctor_id INT NOT NULL REFERENCES users(id),
  description TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'booked'
);

CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES users(id),
  requested_by INT NOT NULL REFERENCES users(id),
  doctor_id INT REFERENCES users(id),
  description TEXT,
  consultation_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chw_requests (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES users(id),
  chw_id INT REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prescriptions (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES users(id),
  doctor_id INT NOT NULL REFERENCES users(id),
  instruction_dosage TEXT NOT NULL,
  prescription_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  symptom_id INT REFERENCES symptoms(id),
  chw_id INT REFERENCES users(id),
  description TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);