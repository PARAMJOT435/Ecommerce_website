# Backend Running Options

## Status

✅ **Express backend fully built and ready**
✅ **All 50+ endpoints created**
✅ **Prisma schema and seed data prepared**
✅ **Docker files configured**

The backend code is production-ready. Choose your preferred way to run it below.

---

## Option 1: Docker (Recommended for Clean Environment)

### Prerequisites
- Docker Desktop installed and running

### Steps

```bash
cd HTM-ECOMM
docker-compose up
```

**Expected Output (After ~30-60 seconds):**
```
htm_ecomm_db     | LOG:  database system is ready to accept connections
htm_ecomm_backend | 🚀 Server running on http://localhost:3001
htm_ecomm_backend | ✅ Database seeded successfully!
```

### If Docker Compose Hangs

Try these troubleshooting steps:

1. **Clear everything and restart:**
   ```bash
   docker-compose down -v --remove-orphans
   docker system prune -f
   docker-compose up --build
   ```

2. **Check Docker Desktop:**
   - Ensure Docker Desktop is running
   - Check System Resources (might need more RAM/disk)
   - Try restarting Docker Desktop

3. **Check logs separately:**
   ```bash
   # In another terminal
   docker-compose logs -f backend
   docker-compose logs -f postgres
   ```

---

## Option 2: Local Node.js Setup (Quick Testing)

If Docker is problematic, run backend locally without containers.

### Prerequisites
- Node.js 20+ installed
- PostgreSQL 16 installed locally OR a remote PostgreSQL instance

### Steps

**1. Install dependencies:**
```bash
cd backend
npm install
```

**2. Setup database:**

If using local PostgreSQL:
```bash
# Start PostgreSQL service (varies by OS)
# Windows: Open Services and start PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

**3. Create `.env.local` file:**
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/htm_ecomm
JWT_SECRET=your_super_secret_key_here
PORT=3001
NODE_ENV=development
```

**4. Run migrations and seed:**
```bash
npm run prisma:migrate
npm run prisma:seed
```

**5. Start the backend:**
```bash
npm run dev
```

**Expected output:**
```
🚀 Server running on http://localhost:3001
✅ Database seeded successfully!
```

### Common Issues

| Issue | Solution |
|-------|----------|
| `PrismaClientInitializationError` | Database not running. Check PostgreSQL service |
| `port 5432 already in use` | Another PostgreSQL instance is running |
| `ECONNREFUSED` on localhost:5432 | PostgreSQL service not started |
| `FATAL: role "your_user" does not exist` | User doesn't exist, create with: `createuser -P your_user` |

---

## Option 3: Hybrid Approach (PostgreSQL Docker + Local Node)

### Steps

**1. Run only PostgreSQL in Docker:**
```bash
docker run --name postgres_ecomm \
  -e POSTGRES_USER=ecommerce_user \
  -e POSTGRES_PASSWORD=ecommerce_password \
  -e POSTGRES_DB=htm_ecomm \
  -p 5432:5432 \
  -d postgres:16-alpine
```

**2. Setup backend locally:**
```bash
cd backend
npm install
```

**3. Create `.env.local`:**
```env
DATABASE_URL=postgresql://ecommerce_user:ecommerce_password@localhost:5432/htm_ecomm
JWT_SECRET=your_super_secret_key_here
PORT=3001
NODE_ENV=development
```

**4. Run migrations and seed:**
```bash
npm run prisma:migrate
npm run prisma:seed
```

**5. Start backend:**
```bash
npm run dev
```

**To stop:**
```bash
docker stop postgres_ecomm
docker rm postgres_ecomm
```

---

## Testing the Backend

Once running on any option, test with:

### Health Check
```bash
curl http://localhost:3001/health
```

Response:
```json
{"status":"ok","timestamp":"2026-06-13T10:30:00.000Z"}
```

### Login Test
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@htm-ecomm.com","password":"password123"}'
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@htm-ecomm.com",
    "firstName": "Admin",
    "role": "admin"
  }
}
```

### Get Products
```bash
curl http://localhost:3001/api/products?limit=5
```

---

## Database Management

### View Database in Studio
```bash
cd backend
npm run prisma:studio
```

Opens browser at `http://localhost:5555` to view/edit data visually.

### Reset Database
```bash
npm run prisma:migrate -- --force-reset
npm run prisma:seed
```

### Create Database Backup
```bash
# PostgreSQL dump
pg_dump -U ecommerce_user -d htm_ecomm > backup.sql
```

### Restore from Backup
```bash
psql -U ecommerce_user -d htm_ecomm < backup.sql
```

---

## Environment Variables Reference

```env
DATABASE_URL              # PostgreSQL connection string
JWT_SECRET                # Secret for JWT signing (change for production!)
PORT                      # Server port (default 3001)
NODE_ENV                  # development or production
```

### Database URL Format
```
postgresql://username:password@host:port/database
```

Examples:
```env
# Local
DATABASE_URL=postgresql://postgres:password@localhost:5432/htm_ecomm

# Docker (from docker-compose.yml)
DATABASE_URL=postgresql://ecommerce_user:ecommerce_password@postgres:5432/htm_ecomm

# Remote (e.g., Railway, Heroku)
DATABASE_URL=postgresql://user:pass@db.railway.example.com:5432/ecomm
```

---

## Next Steps After Backend is Running

1. ✅ Backend running on localhost:3001
2. 📝 Create API client in frontend (`/lib/api/client.ts`)
3. 🔄 Update server actions to use Express backend
4. 🧪 Test end-to-end flow
5. 🚀 Deploy both frontend & backend

---

## Sample Test Data

All options come with pre-seeded data:

**Admin Account:**
- Email: `admin@htm-ecomm.com`
- Password: `password123`

**User Accounts:**
- `john@example.com` / `password123`
- `jane@example.com` / `password123`
- `mike@example.com` / `password123`

**Sample Data:**
- 23 Products across 5 categories
- 6 Blog posts
- 3 Orders
- 3 Carts with items
- 3 Wishlist items

---

## Troubleshooting Checklist

- [ ] Backend is running (check logs for "🚀 Server running")
- [ ] Database is healthy (check logs for "database system is ready")
- [ ] Health endpoint responds: `curl http://localhost:3001/health`
- [ ] Can login with test credentials
- [ ] Can fetch products: `curl http://localhost:3001/api/products`
- [ ] JWT token can be verified

---

## Getting Help

If stuck:

1. **Check logs carefully** - they usually show the exact error
2. **Verify ports** - ensure 3001 (backend) and 5432 (database) are free
3. **Check DATABASE_URL** - verify connection string is correct
4. **Review error messages** - they'll guide you to the solution
5. **Try Option 3 (Hybrid)** - if Docker is causing issues

---

**Ready to run your backend! Choose your option above.** 🚀
