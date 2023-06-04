import {inject, injectable} from "inversify";
import {PrismaClient} from "@prisma/client";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
    ) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log('[PrismaService] Connection was successful');
        } catch (e) {
            if (e instanceof Error) {
                this.logger.log('[PrismaService] Connection was failed: ' + e.message);
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}