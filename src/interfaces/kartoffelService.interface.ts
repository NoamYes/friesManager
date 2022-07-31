interface IKartoffelService {
    getEntityDis: (entityId: string) => Promise<string[]>;
}

export default IKartoffelService;
