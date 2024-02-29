import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { DummyController } from "./dummy.controller";

@Module({
    imports: [
        SharedModule,
    ],
    controllers: [
        DummyController,
    ],
})
export class DummyModule { }
