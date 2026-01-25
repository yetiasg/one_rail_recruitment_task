import { registerOrderOrganizationAssociation } from "./order-organization.assoctiations";
import { registerOrderUserAssociation } from "./order-user.associations";
import { registerUserOrganizationAssociation } from "./user-organization.association";

export function associateSequelizeModels() {
  registerUserOrganizationAssociation();
  registerOrderUserAssociation();
  registerOrderOrganizationAssociation();
}
