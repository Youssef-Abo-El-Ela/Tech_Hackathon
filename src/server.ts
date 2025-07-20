import app from "./app";
import { PORT } from "./config/env";
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import { socketManager } from './config/socket';

const server = createServer(app);

// Initialize Socket.IO
socketManager.initialize(server);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(undefined, {
    swaggerOptions: {
        url: "/swagger.yaml",
    }
}));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});