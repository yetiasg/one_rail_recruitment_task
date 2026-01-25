import { DataTypes, Model, type Sequelize } from "sequelize";

export class OrderModel extends Model {
  declare id: string;
  declare orderDate: Date;
  declare totalAmount: number;
  declare userId: string;
  declare organizationId: string;

  static register(sequelize: Sequelize) {
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
          field: "order_date",
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
  }
}
