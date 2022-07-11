export enum GROUP_TYPE {
    SECURITY = 'security',
    DISTRIBUTION = 'distribution',
}

export enum REQUEST_TYPE {
    CREATE_GROUP = 'create_group', // TODO: should change names?
    ADD_DIS_GROUP = 'add_dis_group',
}

export enum RESPONSIBILITY_PERM {
    GROUP = 'group',
    ENTITY = 'entity',
}

export enum APPROVAL_ROUND_STATUS {
    AWAITING_EXECUTION = 'awaiting for execution',
    AWAITNG_APPROVALS = 'awaiting for approvals',
    DENIED = 'denied',
    APPROVED = 'approved',
}
