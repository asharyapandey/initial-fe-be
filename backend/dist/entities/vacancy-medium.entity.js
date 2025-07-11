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
import { Medium } from "./medium.entity.js";
import { Vacancy } from "./vacancy.entity.js";
let VacancyMedium = class VacancyMedium extends BaseEntity {
    mediumURL;
    medium;
    vacancy;
};
__decorate([
    Column({ name: "medium_url", length: 100 }),
    __metadata("design:type", String)
], VacancyMedium.prototype, "mediumURL", void 0);
__decorate([
    ManyToOne(() => Medium, (medium) => medium.vacancyMediums, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "medium_id" }),
    __metadata("design:type", Object)
], VacancyMedium.prototype, "medium", void 0);
__decorate([
    ManyToOne(() => Vacancy, (vacancy) => vacancy.vacancyMediums, {
        onDelete: "RESTRICT",
    }),
    JoinColumn({ name: "vacancy_id" }),
    __metadata("design:type", Object)
], VacancyMedium.prototype, "vacancy", void 0);
VacancyMedium = __decorate([
    Entity(),
    Unique("UQ_Vacancy_Medium", ["vacancy", "medium"])
], VacancyMedium);
export { VacancyMedium };
//# sourceMappingURL=vacancy-medium.entity.js.map