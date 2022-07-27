export enum GROUP_TYPE {
    SECURITY = 'security',
    DISTRIBUTION = 'distribution',
}

export enum REQUEST_TYPE {
    BASE_REQ = 'basic_request',
    CREATE = 'create', // TODO: should change names?
    ADD_DIS = 'add_dis',
    REMOVE_DIS = 'remove_dis',
    ADD_ENTITIES = 'add_entities',
    REMOVE_ENTITIES = 'remove_entities',
    RENAME = 'rename',
    ADD_ADMINS = 'add_admins',
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
    IN_PROCESS = 'in_process',
    WAITING_FOR_APPROVALS = 'waiting_for_approvals',
    DENIED = 'denied',
}
