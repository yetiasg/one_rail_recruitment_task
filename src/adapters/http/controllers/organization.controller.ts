import type { Response } from "express";
import { Controller } from "@kernel/docorators/controller.decorator";
import {
  Delete,
  Get,
  Post,
  Put,
} from "@kernel/docorators/http-methods.decorator";
import { Body, Param, Query, Res } from "@kernel/docorators/params.decorator";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { CreateOrganizationRequestDto } from "../dto/organization/create-organization.request.dto";
import { FindOrganizationsPagedUseCase } from "@modules/organization/application/use-cases/find-organizations-paged.use-case";
import { FindOrganizationByIdUseCase } from "@modules/organization/application/use-cases/find-organization-by-id.use-case";
import { DeleteOrganizationUseCase } from "@modules/organization/application/use-cases/delete-organization.use-case";
import { UpdateOrganizationUseCase } from "@modules/organization/application/use-cases/update-organization.use-case";
import { CreateOrganizationUseCase } from "@modules/organization/application/use-cases/create-organization.use-case";

@Controller("organizations")
export class OrganizationController {
  constructor(
    private readonly findOrganizationsPagedUseCase: FindOrganizationsPagedUseCase,
    private readonly findOrganizationByIdUseCase: FindOrganizationByIdUseCase,
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
    private readonly deleteOrganizationUseCase: DeleteOrganizationUseCase,
  ) {}

  @Get()
  async findOrganizationsPaged(
    @Query("page") pageRaw: string | undefined,
    @Query("pageSize") pageSizeRaw: string | undefined,
    @Query("sortDir") sortDir: "asc" | "desc" | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const page = pageRaw ? Number(pageRaw) : undefined;
    const pageSize = pageSizeRaw ? Number(pageSizeRaw) : undefined;
    const result = await this.findOrganizationsPagedUseCase.execute({
      page,
      pageSize,
      sortDir: sortDir ?? "asc",
    });
    res.status(200).send(result);
  }

  @Get(":organizationId")
  async findOrganizationById(
    @Param("organizationId") organizationId: Organization["id"],
    @Res() res: Response,
  ): Promise<void> {
    const organization =
      await this.findOrganizationByIdUseCase.execute(organizationId);
    res.status(200).send({ organization });
  }

  @Post()
  async createOrganization(
    @Body(CreateOrganizationRequestDto) data: CreateOrganizationRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const organization = await this.createOrganizationUseCase.execute(data);
    res.status(201).send({ organization });
  }

  @Put(":organizationId")
  async updateOrganization(
    @Param("organizationId") organizationId: Organization["id"],
    @Body(CreateOrganizationRequestDto) data: CreateOrganizationRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const organization = await this.updateOrganizationUseCase.execute(
      organizationId,
      data,
    );
    res.status(200).send({ organization });
  }

  @Delete(":organizationId")
  async deleteOrganization(
    @Param("organizationId") organizationId: Organization["id"],
    @Res() res: Response,
  ): Promise<void> {
    const organization =
      await this.deleteOrganizationUseCase.execute(organizationId);
    res.status(200).send({ organization });
  }
}
