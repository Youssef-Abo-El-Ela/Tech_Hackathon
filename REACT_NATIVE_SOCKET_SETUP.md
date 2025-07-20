# React Native Socket.IO Setup for Real-time Updates

This document explains how to integrate Socket.IO with your React Native mobile app to receive real-time updates when beneficiaries update their location or alert status.

## Prerequisites

Install the required dependencies in your React Native project:

```bash
npm install socket.io-client
# or
yarn add socket.io-client
```

## Socket.IO Client Setup

### 1. Create Socket Service

Create a new file `src/services/socketService.js`:

```javascript
import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Connect to the server
  connect(serverUrl, token) {
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
      
      // Authenticate as admin
      this.socket.emit('admin:authenticate', { token });
    });

    this.socket.on('admin:authenticated', () => {
      console.log('Admin authenticated successfully');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  // Listen for beneficiary location updates
  onLocationUpdate(callback) {
    if (this.socket) {
      this.socket.on('beneficiary:location-updated', callback);
    }
  }

  // Listen for beneficiary alert status updates
  onAlertStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on('beneficiary:alert-updated', callback);
    }
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

export default new SocketService();
```

### 2. Update Your Admin Screen

Update your admin screen to use the socket service:

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import socketService from '../services/socketService';

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to socket when component mounts
    const serverUrl = 'YOUR_BACKEND_URL'; // e.g., 'https://your-app.vercel.app'
    const adminToken = 'YOUR_ADMIN_TOKEN'; // Get this from your login process
    
    socketService.connect(serverUrl, adminToken);

    // Listen for real-time updates
    socketService.onLocationUpdate((data) => {
      console.log('Location update received:', data);
      updateUserInList(data);
    });

    socketService.onAlertStatusUpdate((data) => {
      console.log('Alert status update received:', data);
      updateUserInList(data);
    });

    // Load initial users list
    loadUsers();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInList = (updateData) => {
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === updateData.beneficiaryId) {
          return {
            ...user,
            latitude: updateData.latitude,
            longitude: updateData.longitude,
            location_updated_at: updateData.location_updated_at,
            alert_status: updateData.alert_status,
            alert_time: updateData.alert_time,
          };
        }
        return user;
      });
    });

    // Show notification for alert status changes
    if (updateData.alert_status) {
      Alert.alert(
        'Emergency Alert',
        `Beneficiary ${updateData.beneficiary.name} has triggered an emergency alert!`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text>Phone: {item.phone_number}</Text>
      <Text>Location: {item.latitude}, {item.longitude}</Text>
      <Text style={[
        styles.alertStatus,
        { color: item.alert_status ? 'red' : 'green' }
      ]}>
        Alert Status: {item.alert_status ? 'ACTIVE' : 'Inactive'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beneficiaries List</Text>
      <Text style={styles.connectionStatus}>
        Connection: {socketService.getConnectionStatus() ? 'Connected' : 'Disconnected'}
      </Text>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadUsers}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  connectionStatus: {
    fontSize: 12,
    marginBottom: 16,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertStatus: {
    fontWeight: 'bold',
    marginTop: 8,
  },
};

export default AdminScreen;
```

### 3. Environment Configuration

Create a config file `src/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'https://your-backend-url.vercel.app',
  SOCKET_URL: 'https://your-backend-url.vercel.app',
};

export const getAuthToken = () => {
  // Implement your token storage logic here
  // This could be from AsyncStorage, SecureStore, etc.
  return 'your-admin-token';
};
```

## Features

### Real-time Updates
- **Location Updates**: When a beneficiary updates their location, all connected admin devices receive the update immediately
- **Alert Status Updates**: When a beneficiary triggers an alert, admins receive instant notifications
- **Automatic Reconnection**: The socket automatically reconnects if the connection is lost

### Event Types

1. **`beneficiary:location-updated`**: Emitted when a beneficiary updates their location
   ```javascript
   {
     beneficiaryId: "user-id",
     latitude: 40.7128,
     longitude: -74.0060,
     location_updated_at: "2024-01-01T12:00:00Z",
     beneficiary: { /* full beneficiary object */ },
     timestamp: "2024-01-01T12:00:00Z"
   }
   ```

2. **`beneficiary:alert-updated`**: Emitted when a beneficiary updates their alert status
   ```javascript
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

## Backend Configuration

Make sure your backend has the following environment variables:

```env
REDIS_URL=your-redis-url
JWT_SECRET=your-jwt-secret
```

For Vercel deployment, you'll need to:
1. Set up a Redis instance (e.g., Upstash, Redis Cloud)
2. Add the Redis URL to your Vercel environment variables
3. Deploy your updated backend

## Testing

1. Start your backend server
2. Connect your React Native app
3. Have a beneficiary update their location or alert status
4. Verify that the admin app receives real-time updates

## Troubleshooting

- **Connection Issues**: Check your server URL and ensure CORS is properly configured
- **Authentication Issues**: Verify that your admin token is valid
- **Redis Issues**: Ensure your Redis instance is accessible and properly configured 