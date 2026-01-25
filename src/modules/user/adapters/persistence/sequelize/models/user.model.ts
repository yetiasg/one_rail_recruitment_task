import { DataTypes, Model, type Sequelize } from "sequelize";

export class UserModel extends Model {
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare organizationId: string;
  declare dateCreated: Date;
  declare updatedAt: Date;

  static register(sequelize: Sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.STRING(36),
          primaryKey: true,
          allowNull: false,
        },
        firstName: { type: DataTypes.STRING(100), allowNull: false },
        lastName: { type: DataTypes.STRING(100), allowNull: false },
        email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        organizationId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          field: "organization_id",
          references: {
            model: "organizations",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        dateCreated: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "date_created",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "users",
        timestamps: false,
        underscored: true,
      },
    );
  }
}
