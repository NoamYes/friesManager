export enum GROUP_TYPE {
    SECURITY = 'security',
    DISTRIBUTION = 'distribution',
}

export enum REQUEST_TYPE {
    BASE_REQ = 'basic_request',
    CREATE_GROUP = 'create_group', // TODO: should change names?
    ADD_DIS_GROUP = 'add_dis_group',
}

export enum RESPONSIBILITY_PERM {
    GROUP = 'group',
    ENTITY = 'entity',
}

export enum APPROVAL_ROUND_STATUS {
    AWAITING = 'awaiting',
    DENIED = 'denied',
    APPROVED = 'approved',
}

export enum REQUEST_STATUS {
    DONE = 'done',
    FAILED = 'failed',
    IN_PROCESS = 'in_process'
}
