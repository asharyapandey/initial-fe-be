var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, Unique, } from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { Candidate } from "./candidate.entity.js";
import { Medium } from "./medium.entity.js";
import { Shortlist } from "./shortlist.entity.js";
import { Status } from "./status.entity.js";
import { Vacancy } from "./vacancy.entity.js";
let VacancyCandidate = class VacancyCandidate extends BaseEntity {
    remarks;
    candidate;
    vacancy;
    shortlist;
    status;
    medium;
};
__decorate([
    Column({ type: "longtext", nullable: true }),
    __metadata("design:type", String)
], VacancyCandidate.prototype, "remarks", void 0);
__decorate([
    ManyToOne(() => Candidate, (candidate) => candidate.vacancyCandidates, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "candidate_id" }),
    __metadata("design:type", Object)
], VacancyCandidate.prototype, "candidate", void 0);
__decorate([
    ManyToOne(() => Vacancy, (vacancy) => vacancy.vacancyCandidates, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "vacancy_id" }),
    __metadata("design:type", Object)
], VacancyCandidate.prototype, "vacancy", void 0);
__decorate([
    ManyToOne(() => Shortlist, (shortlist) => shortlist.vacancyCandidates, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "shortlist_id" }),
    __metadata("design:type", Object)
], VacancyCandidate.prototype, "shortlist", void 0);
__decorate([
    ManyToOne(() => Status, (status) => status.vacancyCandidates, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "status_id" }),
    __metadata("design:type", Status)
], VacancyCandidate.prototype, "status", void 0);
__decorate([
    ManyToOne(() => Medium, (medium) => medium.vacancyMediums, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "medium_id" }),
    __metadata("design:type", Object)
], VacancyCandidate.prototype, "medium", void 0);
VacancyCandidate = __decorate([
    Entity(),
    Unique("UQ_Candidates", ["vacancy", "candidate"]),
    Unique("UQ_Shortlist_Candidates", ["candidate", "shortlist"])
], VacancyCandidate);
export { VacancyCandidate };
//# sourceMappingURL=vacancy-candidate.entity.js.map