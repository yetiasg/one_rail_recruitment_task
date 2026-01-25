import { DataTypes, Model, type Sequelize } from "sequelize";

export class OrganizationModel extends Model {
  declare id: string;
  declare name: string;
  declare industry: string;
  declare dateFounded: Date;
  declare createdAt: Date;
  declare updatedAt: Date;

  static register(sequelize: Sequelize) {
    OrganizationModel.init(
      {
        id: {
          type: DataTypes.STRING(36),
          primaryKey: true,
          allowNull: false,
        },
        name: { type: DataTypes.STRING(100), allowNull: false },
        industry: { type: DataTypes.STRING(100), allowNull: false },
        dateFounded: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "date_founded",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "organizations",
        timestamps: true,
        underscored: true,
      },
    );
  }
}
