import {NestFactory} from '@nestjs/core';
import {AppModule} from "./app.module";
import {Logger} from "@nestjs/common";

const bootstrap = async () => {
    const logger = new Logger(bootstrap.name);

    try {
        const PORT = process.env.PORT || 5000;
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        app.listen(PORT, () => logger.log(`server started on PORT ${PORT}`));
    } catch (e) {
        logger.error(e);
    }
}

bootstrap();