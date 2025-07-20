# Tech4Palestine Hackathon - Real-time Beneficiary Tracking System

A real-time system for tracking beneficiaries' location and alert status with instant updates to admin mobile applications.

## Features

- **Real-time Location Updates**: Beneficiaries can update their location, and admins receive instant notifications
- **Emergency Alert System**: Beneficiaries can trigger emergency alerts that immediately notify all connected admins
- **Socket.IO Integration**: Real-time communication between backend and React Native mobile app
- **Redis Adapter**: Scalable real-time solution compatible with Vercel serverless deployment
- **JWT Authentication**: Secure authentication for both beneficiaries and admins

## Architecture

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   React Native  │◄──────────────►│   Backend API   │
│   Mobile App    │                 │   (Vercel)      │
└─────────────────┘                 └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   Redis Cache   │
                                    │   (Upstash)     │
                                    └─────────────────┘
```

## Backend Setup

### Prerequisites

1. **Redis Instance**: Set up a Redis instance (recommended: Upstash for Vercel compatibility)
2. **Environment Variables**: Configure the following in your Vercel dashboard

### Environment Variables

```env
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-jwt-secret-key
REDIS_URL=your-redis-connection-string
```

### Installation

```bash
npm install
npm run build
```

### Local Development

```bash
npm run dev
```

## Real-time Events

### Location Update Event
When a beneficiary updates their location:

```javascript
// Event: beneficiary:location-updated
{
  beneficiaryId: "user-id",
  latitude: 40.7128,
  longitude: -74.0060,
  location_updated_at: "2024-01-01T12:00:00Z",
  beneficiary: { /* full beneficiary object */ },
  timestamp: "2024-01-01T12:00:00Z"
}
```

### Alert Status Update Event
When a beneficiary triggers an emergency alert:

```javascript
// Event: beneficiary:alert-updated
{
  beneficiaryId: "user-id",
  latitude: 40.7128,
  longitude: -74.0060,
  location_updated_at: "2024-01-01T12:00:00Z",
  alert_status: true,
  alert_time: "2024-01-01T12:00:00Z",
  beneficiary: { /* full beneficiary object */ },
  timestamp: "2024-01-01T12:00:00Z"
}
```

## API Endpoints

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all beneficiaries (paginated)
- `POST /api/admin/create-beneficiary` - Create new beneficiary
- `GET /api/admin/socket-status` - Check socket connection status

### Beneficiary Endpoints
- `POST /api/beneficiary/login` - Beneficiary login
- `PUT /api/beneficiary/update-location` - Update location
- `PUT /api/beneficiary/update-alert-status` - Update alert status

## React Native Integration

See `REACT_NATIVE_SOCKET_SETUP.md` for detailed React Native implementation instructions.

### Quick Setup

1. Install Socket.IO client:
```bash
npm install socket.io-client
```

2. Connect to the backend:
```javascript
import io from 'socket.io-client';

const socket = io('https://your-backend-url.vercel.app');

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('admin:authenticate', { token: 'your-admin-token' });
});

socket.on('beneficiary:location-updated', (data) => {
  console.log('Location update:', data);
  // Update your UI here
});

socket.on('beneficiary:alert-updated', (data) => {
  console.log('Alert update:', data);
  // Show emergency notification
});
```

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Vercel

- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `REDIS_URL`: Your Redis connection string (Upstash recommended)

## Testing

### Test Socket Connection

```bash
curl -X GET "https://your-backend-url.vercel.app/api/admin/socket-status" \
  -H "Authorization: Bearer your-admin-token"
```

### Test Location Update

```bash
curl -X PUT "https://your-backend-url.vercel.app/api/beneficiary/update-location" \
  -H "Authorization: Bearer beneficiary-token" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "location_updated_at": "2024-01-01T12:00:00Z"
  }'
```

## Troubleshooting

### Common Issues

1. **Socket Connection Fails**
   - Check Redis URL configuration
   - Verify CORS settings
   - Ensure Vercel environment variables are set

2. **Real-time Updates Not Working**
   - Verify admin authentication
   - Check Redis connection
   - Ensure beneficiary is updating through the API

3. **Vercel Deployment Issues**
   - Check build logs for TypeScript errors
   - Verify all environment variables are set
   - Ensure Redis instance is accessible

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=socket.io:*
```

## Security Considerations

- JWT tokens are used for authentication
- Redis connection is secured with SSL
- CORS is configured for production domains
- All sensitive data is encrypted in transit

## Performance

- Redis adapter ensures scalability across multiple server instances
- Socket.IO automatically handles reconnection
- Efficient event emission to specific admin rooms only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Tech4Palestine Hackathon.