import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { REDIS_URL } from './env';

export interface SocketUser {
    id: string;
    role: 'admin' | 'beneficiary';
    socketId: string;
}

export class SocketManager {
    private io: Server | null = null;
    private redisClient: any = null;
    private redisSubscriber: any = null;

    async initialize(server: any) {
        // Create Redis clients
        this.redisClient = createClient({
            url: REDIS_URL
        });
        
        this.redisSubscriber = this.redisClient.duplicate();

        await Promise.all([
            this.redisClient.connect(),
            this.redisSubscriber.connect()
        ]);

        // Create Socket.IO server
        this.io = new Server(server, {
            cors: {
                origin: "*", // In production, specify your React Native app's domain
                methods: ["GET", "POST"]
            },
            adapter: createAdapter(this.redisClient, this.redisSubscriber)
        });

        this.setupEventHandlers();
        console.log('Socket.IO server initialized with Redis adapter');
    }

    private setupEventHandlers() {
        if (!this.io) return;

        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);

            // Handle admin authentication
            socket.on('admin:authenticate', (data: { token: string }) => {
                // In a real app, verify the JWT token here
                socket.join('admin-room');
                socket.data.user = { role: 'admin', id: 'admin' };
                socket.emit('admin:authenticated');
                console.log('Admin authenticated and joined admin room');
            });

            // Handle beneficiary authentication
            socket.on('beneficiary:authenticate', (data: { token: string }) => {
                // In a real app, verify the JWT token here
                socket.join('beneficiary-room');
                socket.data.user = { role: 'beneficiary', id: 'beneficiary' };
                socket.emit('beneficiary:authenticated');
                console.log('Beneficiary authenticated and joined beneficiary room');
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });
    }

    // Emit to admin room when beneficiary updates location
    emitLocationUpdate(beneficiaryId: string, locationData: any) {
        if (this.io) {
            this.io.to('admin-room').emit('beneficiary:location-updated', {
                beneficiaryId,
                ...locationData,
                timestamp: new Date()
            });
            console.log(`Location update emitted for beneficiary: ${beneficiaryId}`);
        }
    }

    // Emit to admin room when beneficiary updates alert status
    emitAlertStatusUpdate(beneficiaryId: string, alertData: any) {
        if (this.io) {
            this.io.to('admin-room').emit('beneficiary:alert-updated', {
                beneficiaryId,
                ...alertData,
                timestamp: new Date()
            });
            console.log(`Alert status update emitted for beneficiary: ${beneficiaryId}`);
        }
    }

    // Get connected admin count
    getAdminCount(): number {
        if (!this.io) return 0;
        const adminRoom = this.io.sockets.adapter.rooms.get('admin-room');
        return adminRoom ? adminRoom.size : 0;
    }

    // Cleanup method
    async cleanup() {
        if (this.redisClient) {
            await this.redisClient.quit();
        }
        if (this.redisSubscriber) {
            await this.redisSubscriber.quit();
        }
    }
}

export const socketManager = new SocketManager(); 