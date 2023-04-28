import { ProductEntity } from "./ProductEntity";
import { VMResourceEntity } from "./VMResourceEntity";

export interface VendingMachineEntity {
    id: number;
    name: string;
    location: string;
    vmResources: Array<VMResourceEntity>;
    products: Array<ProductEntity>;
}
