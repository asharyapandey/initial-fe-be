var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, } from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { Designation } from "./designation.entity.js";
import { Shortlist } from "./shortlist.entity.js";
import { VacancyCandidate } from "./vacancy-candidate.entity.js";
import { VacancyMedium } from "./vacancy-medium.entity.js";
let Vacancy = class Vacancy extends BaseEntity {
    referenceNo;
    noOfOpenings;
    description;
    openingDate;
    closingDate;
    designation;
    shortlists;
    vacancyMediums;
    vacancyCandidates;
};
__decorate([
    Column({ unique: true, name: "reference_no", length: 20 }),
    __metadata("design:type", String)
], Vacancy.prototype, "referenceNo", void 0);
__decorate([
    Column({ name: "no_of_openings" }),
    __metadata("design:type", Number)
], Vacancy.prototype, "noOfOpenings", void 0);
__decorate([
    Column({ type: "longtext" }),
    __metadata("design:type", String)
], Vacancy.prototype, "description", void 0);
__decorate([
    Column({
        type: "date",
        name: "opening_date",
    }),
    __metadata("design:type", Date)
], Vacancy.prototype, "openingDate", void 0);
__decorate([
    Column({
        type: "date",
        name: "closing_date",
        nullable: true,
    }),
    __metadata("design:type", Date)
], Vacancy.prototype, "closingDate", void 0);
__decorate([
    ManyToOne(() => Designation, (designation) => designation.vacancies, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "designation_id" }),
    __metadata("design:type", Object)
], Vacancy.prototype, "designation", void 0);
__decorate([
    OneToMany(() => Shortlist, (shortlist) => shortlist.vacancy),
    __metadata("design:type", Array)
], Vacancy.prototype, "shortlists", void 0);
__decorate([
    OneToMany(() => VacancyMedium, (vacancyMedium) => vacancyMedium.vacancy),
    __metadata("design:type", Array)
], Vacancy.prototype, "vacancyMediums", void 0);
__decorate([
    OneToMany(() => VacancyCandidate, (vacancyCandidate) => vacancyCandidate.vacancy),
    __metadata("design:type", Array)
], Vacancy.prototype, "vacancyCandidates", void 0);
Vacancy = __decorate([
    Entity()
], Vacancy);
export { Vacancy };
//# sourceMappingURL=vacancy.entity.js.map