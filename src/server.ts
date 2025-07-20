import app from "./app";
import { PORT } from "./config/env";
import swaggerUi from 'swagger-ui-express';

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(undefined, {
    swaggerOptions: {
        url: "/swagger.yaml",
    }
}));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});