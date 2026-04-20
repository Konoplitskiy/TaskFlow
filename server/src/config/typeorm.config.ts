import { ConfigService } from "@nestjs/config";

export const typeOrmConfig = (configService:ConfigService) => ({
    type:'postgres' as const,
    host: configService.get<string>('POSTGRES_HOST'),
    port:Number(configService.get<string>('POSTGRES_PORT')),
    username:configService.get<string>('POSTGRES_USER'),
    password:configService.get<string>('POSTGRES_PASSWORD'),
    database:configService.get<string>('POSTGRES_DB'),
    autoLoadEntities:true,
    synchronize:false,
})