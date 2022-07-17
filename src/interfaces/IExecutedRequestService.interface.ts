export interface IExecutedRequestsService {
    executedRequest(requestNumber: number): Promise<boolean>;
}
