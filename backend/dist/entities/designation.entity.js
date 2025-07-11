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
import { BaseEntity } from "./base.entity.js";
import { Vacancy } from "./vacancy.entity.js";
let Designation = class Designation extends BaseEntity {
    name;
    color;
    code;
    vacancies;
};
__decorate([
    Column({ unique: true, length: 30 }),
    __metadata("design:type", String)
], Designation.prototype, "name", void 0);
__decorate([
    Column({ unique: true, length: 10 }),
    __metadata("design:type", String)
], Designation.prototype, "color", void 0);
__decorate([
    Column({ unique: true, length: 10 }),
    __metadata("design:type", String)
], Designation.prototype, "code", void 0);
__decorate([
    OneToMany(() => Vacancy, (vacancy) => vacancy.designation, {
        onDelete: "RESTRICT",
    }),
    __metadata("design:type", Array)
], Designation.prototype, "vacancies", void 0);
Designation = __decorate([
    Entity()
], Designation);
export { Designation };
//# sourceMappingURL=designation.entity.js.map