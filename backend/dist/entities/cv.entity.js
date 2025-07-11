var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MINIO_BASE_URL } from "../libs/utils/constants.js";
import { BaseEntity } from "./base.entity.js";
import { Candidate } from "./candidate.entity.js";
let CV = class CV extends BaseEntity {
    minioFileName;
    fileName;
    recievedAt;
    candidate;
    toJSON() {
        return {
            ...this,
            fileURL: `${MINIO_BASE_URL}/${this.minioFileName}`,
        };
    }
};
__decorate([
    Column({ name: "minio_file_name", length: 100 }),
    __metadata("design:type", String)
], CV.prototype, "minioFileName", void 0);
__decorate([
    Column({ name: "file_name", length: 30 }),
    __metadata("design:type", String)
], CV.prototype, "fileName", void 0);
__decorate([
    Column({
        type: "date",
        name: "recieved_at",
    }),
    __metadata("design:type", Date)
], CV.prototype, "recievedAt", void 0);
__decorate([
    ManyToOne(() => Candidate, (candidate) => candidate.cvs, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "candidate_id" }),
    __metadata("design:type", Object)
], CV.prototype, "candidate", void 0);
CV = __decorate([
    Entity()
], CV);
export { CV };
//# sourceMappingURL=cv.entity.js.map