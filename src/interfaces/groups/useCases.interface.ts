import { groupResponseDTO } from "../../useCases/group.useCases";

export interface IGroupUseCases {
    getById(id: string): Promise<groupResponseDTO>;
    getByName(name: string): Promise<groupResponseDTO>;
    getByAdminId(id: string): Promise<groupResponseDTO[]>
}