import { sequelize } from "@infrastructure/db/sequelize.instance";
import { DataTypes, Model } from "sequelize";

export class OrderModel extends Model {
  declare id: string;
  declare orderDate: Date;
  declare totalAmount: string;
  declare userId: string;
  declare organizationId: string;
}

OrderModel.init(
  {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    userId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    organizationId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "organizations",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    orderDate: {
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
    tableName: "orders",
    timestamps: false,
    underscored: true,
  },
);
