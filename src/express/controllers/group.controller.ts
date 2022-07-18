import { IGroupController } from '../../interfaces/groups/controller.interface';
import { Request, Response } from 'express';
import { IGroupUseCases } from '../../interfaces/groups/useCases.interface';
import { groupResponseDTO } from '../../useCases/group.useCases';

export default class implements IGroupController {
    private _useCases: IGroupUseCases;

    constructor(useCases: IGroupUseCases) {
        this._useCases = useCases;
    }

    public getById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const group: groupResponseDTO = await this._useCases.getById(id);
        res.json(group);
    }

    public getByName = async (req: Request, res: Response): Promise<void> => {
        const { name } = req.params;
        const group: groupResponseDTO = await this._useCases.getByName(name);
        res.json(group);
    }

    public getByAdminId = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const groups: groupResponseDTO[] = await this._useCases.getByAdminId(id);
        res.json(groups);
    }
}
