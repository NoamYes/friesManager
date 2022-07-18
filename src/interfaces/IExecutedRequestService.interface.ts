export interface IExecutedRequestsUseCases {
    executedRequest(requestNumber: number): Promise<boolean>;
}
