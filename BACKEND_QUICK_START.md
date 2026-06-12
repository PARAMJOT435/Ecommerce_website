# Backend Quick Start

## What Was Built

✅ **Complete Express.js backend** with Docker, PostgreSQL, Prisma, and JWT auth  
✅ **50+ REST API endpoints** covering all e-commerce features  
✅ **Diverse sample data** with 23 products, 5 categories, 6 blog posts  
✅ **Supabase untouched** - ready to backtrack if needed  

---

## Start Backend (30 seconds)

### Prerequisites
- Install Docker Desktop (includes Docker Compose)

### Run
```bash
cd HTM-ECOMM
docker-compose up
```

**Wait for message: "✅ Database seeded successfully!"**

### Verify
```bash
curl http://localhost:3001/health
```

Expected: `{"status":"ok","timestamp":"2024-01-15T10:30:00.000Z"}`

---

## Test Login

### Via Postman / curl

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@htm-ecomm.com","password":"password123"}'
```

**Response:**
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

Copy the `token` for authenticated requests.

---

## Test GET Products

```bash
curl http://localhost:3001/api/products?page=1&limit=12
```

---

## Test Protected Endpoint (with token)

```bash
curl -X GET http://localhost:3001/api/account/profile \
  -H "Authorization: Bearer <TOKEN_HERE>"
```

---

## What's Next

1. **Frontend Migration** (Day 3-4)
   - Create API client utility in `/lib/api/`
   - Update server actions to use Express backend
   - Remove Supabase calls

2. **Full Integration Testing**
   - Test entire flow: login → browse → add to cart → checkout

3. **Optional: Frontend Deployment**
   - Backend can stay local (Vercel frontend ↔ Localhost backend)
   - Or deploy both together later

---

## Sample Test Data

**Admin:**
- Email: `admin@htm-ecomm.com`
- Password: `password123`

**Users:**
- `john@example.com` / `password123`
- `jane@example.com` / `password123`
- `mike@example.com` / `password123`

---

## Important Notes

🔒 **Security Reminder:**
- Don't expose JWT_SECRET (change it before deploying)
- Current setup is for development

📝 **API Documentation:**
- See `BACKEND_SETUP_GUIDE.md` for complete endpoint list

🛠️ **Development:**
- Backend runs in hot-reload mode (changes auto-reload)
- Edit files in `backend/src/` and refresh browser

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5432 in use | `docker-compose down -v && docker-compose up` |
| Backend won't start | `docker-compose logs backend` |
| Stuck at startup | Wait ~30 seconds for migrations |

---

## Next Command

Once backend is running, let me know and we'll:
1. Create API client for frontend
2. Update server actions
3. Test end-to-end flow

Status: ✅ **Backend ready**
