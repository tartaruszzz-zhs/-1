# Penality API Documentation

## Base URL
`http://localhost:3000`

## Authentication
### Send Verification Code
- **Endpoint**: `POST /auth/send-code`
- **Body**: `{ "phone": "+8613800000000" }`
- **Response**: `{ "status": "ok", "message": "Verification code sent" }`

### Verify Code
- **Endpoint**: `POST /auth/verify`
- **Body**: `{ "phone": "+8613800000000", "code": "123456" }`
- **Response**: `{ "status": "ok", "token": "eyJ...", "user": { ... } }`

## Test
### Get Configuration
- **Endpoint**: `GET /test/config`
- **Response**: `{ "version": "v1.0", "questions": [ ... ] }`

### Submit Test
- **Endpoint**: `POST /test/submit`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "answers": ["A", "B", ...] }`
- **Response**: 
```json
{
  "test_id": "...",
  "dominant_type": "steel_pen",
  "radar_values": [5, 3, ...],
  "pen_info": { ... }
}
```

## Reports & Payments
### Create Report Order
- **Endpoint**: `POST /reports/create`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "test_id": "...", "type": "ai" }`
- **Response**: `{ "status": "ok", "order_id": "...", "payment_url": "..." }`

### Webhook (Mock)
- **Endpoint**: `POST /webhook/payment`
- **Body**: `{ "order_id": "...", "status": "paid" }`
- **Response**: `{ "status": "success" }`

### Get Report
- **Endpoint**: `GET /reports/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "status": "ready", "content": { ... } }`
