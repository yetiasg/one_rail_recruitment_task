import { Injectable } from "@kernel/di/injectable.decorator";
import {
  OrderRepositoryPort,
  OrderWithRelations,
} from "@modules/order/application/ports/order-repository.port";
import { Order } from "@modules/order/domain/entities/order.entity";
import { OrderModel } from "../models/order.model";
import { OrderPersistenceMapper } from "../mappers/order.persistence-mapper";
import { OrganizationModel } from "@modules/organization/infrastructure/sequelize/models/organization.model";
import { OrganizationPersistenceMapper } from "@modules/organization/infrastructure/sequelize/mappers/organization.persistence-mapper";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/application/pagination/pagination.type";
import { UserModel } from "@modules/user/infrastructure/persistence/sequelize/models/user.model";
import { UserPersistenceMapper } from "@modules/user/infrastructure/persistence/sequelize/mappers/user.persistence-mapper";

@Injectable()
export class OrderRepositoryAdapter implements OrderRepositoryPort {
  async existsById(id: Order["id"]): Promise<boolean> {
    const count = await OrderModel.count({ where: { id } });
    return count > 0;
  }

  async findById(id: Order["id"]): Promise<Order | null> {
    const row = await OrderModel.findByPk(id);
    return row ? OrderPersistenceMapper.toDomain(row) : null;
  }

  async findByIdWithUserAndOrganization(
    id: Order["id"],
  ): Promise<OrderWithRelations | null> {
    const row = await OrderModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          required: true,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "organizationId",
            "dateCreated",
            "updatedAt",
          ],
        },
        {
          model: OrganizationModel,
          required: true,
          attributes: [
            "id",
            "name",
            "industry",
            "dateFounded",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });
    if (!row) return null;

    const json = row.toJSON<
      Order & { UserModel: UserModel; OrganizationModel: OrganizationModel }
    >();

    return {
      order: OrderPersistenceMapper.toDomain(row),
      user: UserPersistenceMapper.toDomain(json.UserModel),
      organization: OrganizationPersistenceMapper.toDomain(
        json.OrganizationModel,
      ),
    };
  }

  async findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<Order>> {
    const { rows, count } = await OrderModel.findAndCountAll({
      offset: query.offset,
      limit: query.limit,
      order: [[query.orderBy.field, query.orderBy.direction.toUpperCase()]],
    });

    return {
      rows: rows.map((row) => OrderPersistenceMapper.toDomain(row)),
      total: count,
    };
  }

  async create(data: Order): Promise<Order> {
    const row = await OrderModel.create({
      orderDate: data.orderDate,
      totalAmount: data.totalAmount,
      userId: data.userId,
      organizationId: data.organizationId,
    });

    return OrderPersistenceMapper.toDomain(row);
  }

  async update(data: Order): Promise<Order> {
    const [, order] = await OrderModel.update(data, {
      where: { id: data.id },
      returning: true,
    });
    return OrderPersistenceMapper.toDomain(order[0]);
  }

  async delete(id: Order["id"]): Promise<boolean> {
    const order = await OrderModel.destroy({ where: { id }, force: true });
    return order > 0;
  }
}
