import { OrganizationModel } from "@modules/organization/infrastructure/sequelize/models/organization.model";
import { UserModel } from "@modules/user/infrastructure/persistence/sequelize/models/user.model";

export function defineAssociations(): void {
  OrganizationModel.hasMany(UserModel, {
    foreignKey: "organizationId",
    sourceKey: "id",
  });

  UserModel.belongsTo(OrganizationModel, {
    foreignKey: "organizationId",
    targetKey: "id",
  });
}
