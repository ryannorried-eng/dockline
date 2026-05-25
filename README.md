# 🎣 Dockline

**AI-powered lead capture and SMS engagement for coastal marine businesses.**

Dockline is a productized service built for marinas, fishing charters, yacht brokers, and boat dealers. It automatically texts back anyone who calls and gets no answer, engages the lead in an AI-powered SMS conversation to capture booking details, and surfaces all leads and conversations in a clean client-facing dashboard.

This demo instance is configured for **San Pedro Sport Fishing** — a full-day and half-day fishing charter operation based in San Pedro, California.

---

## What It Does

| Feature | Description |
|---|---|
| 📲 Missed Call Text-Back | When a call comes in unanswered, Twilio triggers an instant text-back to the caller |
| 🤖 AI SMS Conversations | Claude responds on behalf of the business, capturing name, trip type, date, and group size |
| ✅ Lead Qualification | Once all four booking fields are captured, the lead is marked "qualified" automatically |
| ⭐ Review Requests | Send a Google review request SMS to happy customers with one click |
| 📊 Dashboard | See all leads, conversations, and stats in a clean Next.js UI |
| ⚙️ Configurable | Business name, review link, and text-back message are editable in the Settings page |

---

## Tech Stack

- **Backend**: Python · FastAPI · SQLAlchemy · SQLite
- **Frontend**: Next.js 15 · Tailwind CSS · TypeScript
- **SMS**: Twilio (inbound/outbound voice & SMS webhooks)
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Deploy**: Render (backend) + Vercel (frontend)

---

## Project Structure

```
/dockline
  /backend
    main.py              # FastAPI app entry point
    database.py          # SQLAlchemy engine + session
    models.py            # ORM models (Lead, Message, ReviewRequest, Settings)
    schemas.py           # Pydantic request/response schemas
    /routers
      leads.py           # GET/PATCH /api/leads
      stats.py           # GET /api/stats
      settings.py        # GET/PATCH /api/settings
      webhooks.py        # POST /webhook/missed-call, /webhook/incoming-sms, /api/send-review-request
    /services
      twilio_service.py  # Twilio SMS send helper
      claude_service.py  # Claude API conversation + qualification check
    .env.example
    requirements.txt
  /frontend
    /app
      page.tsx           # Dashboard home
      /leads
        page.tsx         # Leads list
        /[id]
          page.tsx       # Lead detail + conversation thread
      /settings
        page.tsx         # Settings form
    /components
      Sidebar.tsx
      StatsBar.tsx
      LeadsTable.tsx
      ConversationThread.tsx
      StatusBadge.tsx
    /lib
      api.ts             # Typed API client
      utils.ts           # Date formatting helpers
    .env.example
    package.json
  README.md
```

---

## Local Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Twilio](https://www.twilio.com) account with a phone number
- An [Anthropic](https://console.anthropic.com) API key
- [ngrok](https://ngrok.com) for local webhook testing

---

### Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and fill in your API keys

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

Visit `http://localhost:8000/docs` for the interactive Swagger UI.

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`/backend/.env`)

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (from console.anthropic.com) |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID (from Twilio Console) |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token (from Twilio Console) |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number in E.164 format (e.g. `+13105551234`) |
| `DATABASE_URL` | SQLite path, e.g. `sqlite:///./dockline.db` |
| `FRONTEND_URL` | Frontend origin for CORS, e.g. `http://localhost:3000` |

### Frontend (`/frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL, e.g. `http://localhost:8000` |

---

## Configuring Twilio Webhooks with ngrok

When running locally, Twilio needs a public HTTPS URL to send webhook events to. Use ngrok to tunnel your local server:

```bash
# Install ngrok (if not already): https://ngrok.com/download
ngrok http 8000
```

ngrok will give you a URL like `https://abc123.ngrok-free.app`.

### Twilio Console Configuration

1. Log in to [console.twilio.com](https://console.twilio.com)
2. Go to **Phone Numbers → Manage → Active Numbers**
3. Click your Dockline phone number
4. Under **Voice & Fax**:
   - Set **A call comes in** → Webhook → `https://abc123.ngrok-free.app/webhook/missed-call`
   - Set **Call Status Changes** → `https://abc123.ngrok-free.app/webhook/missed-call`
5. Under **Messaging**:
   - Set **A message comes in** → Webhook → `https://abc123.ngrok-free.app/webhook/incoming-sms`
6. Save

> **Tip:** For the missed-call flow to trigger, set the call to go straight to voicemail or configure a short ring timeout. Twilio will fire the webhook with `CallStatus=no-answer` or `CallStatus=busy`.

---

## API Reference

### Leads
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/leads` | List all leads (with message count + preview) |
| `GET` | `/api/leads/:id` | Full lead detail with all messages |
| `PATCH` | `/api/leads/:id` | Update lead name or status |

### Stats
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/stats` | Total leads, qualified, new today, messages sent |

### Settings
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/settings` | Get current settings (seeds defaults on first call) |
| `PATCH` | `/api/settings` | Update business name, review link, or text-back message |

### Webhooks & Actions
| Method | Path | Description |
|---|---|---|
| `POST` | `/webhook/missed-call` | Twilio voice webhook — triggers text-back on no-answer |
| `POST` | `/webhook/incoming-sms` | Twilio SMS webhook — runs AI conversation engine |
| `POST` | `/api/send-review-request` | Send a Google review request SMS to a customer |

---

## Running the Demo

The backend auto-seeds the San Pedro Sport Fishing settings on first start. No manual configuration is needed for the demo to work — just add your API keys and run both servers.

To simulate a lead without a real phone:

1. Make a `POST` request to `/webhook/missed-call` with form data:
   ```
   CallStatus=no-answer&From=+13105551234&To=+13105559876
   ```

2. Then send a simulated SMS reply via `/webhook/incoming-sms`:
   ```
   From=+13105551234&To=+13105559876&Body=Hi, I'd like to book a trip
   ```

3. Watch the lead appear in the dashboard at `http://localhost:3000`.

---

## Deployment

### Backend → Render

1. Push the `/backend` folder to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables in the Render dashboard
6. Update your Twilio webhooks to the Render service URL

### Frontend → Vercel

1. Push the `/frontend` folder to a GitHub repo (or the monorepo root)
2. Import the project on [vercel.com](https://vercel.com)
3. Set the root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com`
5. Deploy

---

## Business Demo: San Pedro Sport Fishing

The Claude AI system prompt is baked in with full knowledge of the business:

- **Full day trips** — $225/person, departs 5:30am, returns ~3:30pm
- **Half day trips** — $125/person, departs 6:00am, returns ~11:00am
- **Private charters** — $1,800 flat, up to 6 passengers
- **Open** Tuesday through Sunday
- **Location**: Ports O Call Village, San Pedro, CA
- All gear and bait included

The AI captures four required fields (name, trip type, date, group size) and once all four are confirmed, it marks the lead as "qualified" and sends a handoff message to the human team.

---

*Built with Dockline — the lead capture platform for the water.*
