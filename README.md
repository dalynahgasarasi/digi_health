# DigiHealth

DigiHealth is a web platform that connects patiets, community health workers (CHWs) and doctors


- **Live app (public URL):** 
https://digihealth-t5hp.onrender.com
- **Demo video:** https://youtu.be/XfDLx0hG9dE
- **Code:** https://github.com/dalynahgasarasi/digi_health


---


---

## 1. What it does

DigiHealth has three types of user (roles).

| Role | What they can do |
|------|------------------|
| **Patient** | Log symptoms (pick pictures or type), book appointments, request a remote consultation, ask for a CHW, view prescriptions |
| **Community health worker (CHW)** | Log symptoms and request consultations for patients who cannot read or write, and respond to patients who ask for help |
| **Doctor** | See urgent symptoms, accept and complete consultations, write digital prescriptions |

**Features**

- Sign up and log in (FR1: authentication)
- Symptom logging with emoji buttons (FR2)
- Appointment booking (FR3)
- Remote consultation requests (FR4)
- Digital prescriptions (FR5)
- English and Kinyarwanda (use the **EN | RW** button)
- Help guide and an **Emergency** button (calls **112**)
- Works on phone and laptop screens


---

## 2. Use the live app (no setup)

1. Open https://digihealth-t5hp.onrender.com in any browser, on a phone or a laptop.
2. Wait up to a minute if the page is slow to load the first time (the free plan might take a bit longer to load the content).
3. Click **Sign up**, choose a role (patient, CHW or doctor), and create an account.
4. Log in and use the tabs at the top.

To see the whole flow, create one account for each role (use a different browser or a private window for each):

1. **Patient:** log a symptom, then book an appointment, then request a consultation.
2. **Doctor:** accept and complete the consultation, then write a prescription.
3. **Patient:** open **Prescriptions** to see it.

---

## 3. Run it on your own computer

Follow every step in order.

### Step 1: Install the tools you need

- **Node.js** version 18 or newer (download from https://nodejs.org). Check with:
  ```bash
  node -v
  npm -v
  ```
- **Git** (https://git-scm.com). Check with `git --version`.

### Step 2: Download the code

```bash
git clone https://github.com/dalynahgasarasi/digi_health
cd projects
```

### Step 3: Install the dependencies

```bash
npm install
```

This reads `package.json` and installs everything the app needs.

### Step 4: Create the database


- *If you have a schema file:* Create an empty database then run the file 

### Step 5: Create the `.env` file

In the project's main folder, create a file named exactly `.env` 



### Step 6: Start the app

```bash
npm start
```

You should see a message that the server is running.

### Step 7: Open it in your browser

Go to **http://localhost:3000**

### Step 8: Check that it works

1. Click **Sign up** and create a patient account.
2. Log in and log a symptom.
3. Click **RW** at the top to check that the language switches.

### If something goes wrong

| Problem | Fix |
|---------|-----|
| `npm: command not found` | Install Node.js again (Step 1) and reopen the terminal |
| `Cannot GET /...` | Restart the server, then reload with Ctrl + Shift + R |
| Port already in use | Change `PORT` in `.env` to `3001`, then restart |
| Cannot connect to the database | Check that the database is running and that the `.env` values are correct |

---

## 4. Deployment

The live app is deployed on **Render**.

1. Push the code to GitHub.
2. On Render, create a new **Web Service** and connect the GitHub repository.
3. Set **Build command** to `npm install` and **Start command** to `npm start`.
4. Under **Environment**, add the same variables as in your `.env` file (`JWT_SECRET` and the database variables).
5. Click **Deploy**. When it says **Live**, open the link.

Every push to `main` redeploys the app automatically.

---

## 5. Project structure

```
├── public/            Front end (what the browser loads)
│   ├── index.html     Login and signup page
│   ├── dashboard.html Main app with tabs
│   ├── style.css      Styles
│   └── i18n.js        English and Kinyarwanda text
├── server.js          Starts the server and serves public/
├── auth.js            Login and signup logic
├── db.js              Database connection
├── package.json       Dependencies and start command
├── .env               Your private settings (not on GitHub)
└── README.md          This file
```


## 6. Limitations and future work

- No admin role or reports yet
- No SMS alerts
- Messages that come from the server are only in English
- Medical records are shown as symptom history and prescriptions only
- The free hosting plan makes the first load slow after a quiet period

