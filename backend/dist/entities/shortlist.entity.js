var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique, } from "typeorm";
import { BaseEntity } from "./base.entity.js";
import { Vacancy } from "./vacancy.entity.js";
import { VacancyCandidate } from "./vacancy-candidate.entity.js";
let Shortlist = class Shortlist extends BaseEntity {
    name;
    vacancy;
    vacancyCandidates;
};
__decorate([
    Column({ length: 25 }),
    __metadata("design:type", String)
], Shortlist.prototype, "name", void 0);
__decorate([
    ManyToOne(() => Vacancy, (vacancy) => vacancy.shortlists, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "vacancy_id" }),
    __metadata("design:type", Object)
], Shortlist.prototype, "vacancy", void 0);
__decorate([
    OneToMany(() => VacancyCandidate, (vacancyCandidate) => vacancyCandidate.shortlist),
    __metadata("design:type", Array)
], Shortlist.prototype, "vacancyCandidates", void 0);
Shortlist = __decorate([
    Entity(),
    Unique("UQ_shortlist", ["vacancy", "name"])
], Shortlist);
export { Shortlist };
//# sourceMappingURL=shortlist.entity.js.map