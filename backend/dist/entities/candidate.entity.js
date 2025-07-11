var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, OneToMany } from "typeorm";
import { Gender } from "../libs/types/index.js";
import { BaseEntity } from "./base.entity.js";
import { CV } from "./cv.entity.js";
import { VacancyCandidate } from "./vacancy-candidate.entity.js";
let Candidate = class Candidate extends BaseEntity {
    firstName;
    middleName;
    lastName;
    email;
    phone;
    address;
    gender;
    cvs;
    vacancyCandidates;
};
__decorate([
    Column({ name: "first_name", length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "firstName", void 0);
__decorate([
    Column({ name: "middle_name", length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "middleName", void 0);
__decorate([
    Column({ name: "last_name", length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "lastName", void 0);
__decorate([
    Column({ unique: true, length: 50 }),
    __metadata("design:type", String)
], Candidate.prototype, "email", void 0);
__decorate([
    Column({ unique: true, length: 10 }),
    __metadata("design:type", String)
], Candidate.prototype, "phone", void 0);
__decorate([
    Column({ length: 30 }),
    __metadata("design:type", String)
], Candidate.prototype, "address", void 0);
__decorate([
    Column({ type: "enum", enum: Gender }),
    __metadata("design:type", String)
], Candidate.prototype, "gender", void 0);
__decorate([
    OneToMany(() => CV, (cv) => cv.candidate),
    __metadata("design:type", Array)
], Candidate.prototype, "cvs", void 0);
__decorate([
    OneToMany(() => VacancyCandidate, (vacancyCandidate) => vacancyCandidate.candidate),
    __metadata("design:type", Array)
], Candidate.prototype, "vacancyCandidates", void 0);
Candidate = __decorate([
    Entity()
], Candidate);
export { Candidate };
//# sourceMappingURL=candidate.entity.js.map