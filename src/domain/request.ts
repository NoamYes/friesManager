// import { REQUEST_TYPE } from './../config/enums';
// import { Types } from 'mongoose';

// type RequestState = {
//     _id?: Types.ObjectId;
//     type: REQUEST_TYPE;
//     applicant: string;
//     createdAt: Date;
//     updatedAt: Date;
// };

// export class Request {
//     private _id?: Types.ObjectId;
//     private type: REQUEST_TYPE;
//     private applicant: string;
//     private createdAt: Date;
//     private updatedAt: Date;

//     private constructor(id: Types.ObjectId, props: RequestState) {
//         this._id = props._id;
//         this.type = props.type;
//         this.applicant = props.applicant;
//         this.createdAt = props.createdAt;
//         this.updatedAt = props.updatedAt;
//     }

//     static _create(_id: Types.ObjectId, state: RequestState): Request {
//         // validate hierarchy & ancestors
//         return new Request(_id, state);
//     }

//     static toPersistance(request: Request): RequestDoc {
//         return {
//             _id: Types.ObjectId(entity.entityId.toString()),
//             firstName: entity.name.firstName,
//             lastName: entity.name.lastName,
//             entityType: entity.entityType,
//             displayName: entity.displayName,
//             personalNumber: entity.personalNumber?.toString(),
//             identityCard: entity.identityCard?.toString(),
//             employeeNumber: entity.employeeNumber?.toString(),
//             organization: entity.organization?.value,
//             rank: entity.rank?.value,
//             akaUnit: entity.akaUnit,
//             clearance: entity.clearance,
//             fullClearance: entity.fullClearance,
//             mail: entity.mail?.value,
//             sex: entity.sex,
//             serviceType: entity.serviceType?.value,
//             dischargeDay: entity.dischargeDay,
//             birthDate: entity.birthDate,
//             jobTitle: entity.jobTitle,
//             address: entity.address, // value?
//             phone: entity.phone.map((p) => p.value),
//             mobilePhone: entity.mobilePhone.map((p) => p.value),
//             goalUserId: entity.goalUserId?.toString(),
//             primaryDigitalIdentityId: entity.primaryDigitalIdentityId?.toString(),
//             version: entity.version,
//             pictures: entity.pictures,
//             createdAt: entity.createdAt,
//         };
//     }

//     static toDomain(raw: RequestDoc): Request {
//         const entityId = EntityId.create(raw._id.toHexString());
//         let createdEntity: Entity;
//         try {
//             createdEntity = Entity._create(
//                 entityId,
//                 {
//                     entityType: raw.entityType,
//                     firstName: raw.firstName,
//                     lastName: raw.lastName,
//                     displayName: raw.displayName,
//                     personalNumber: !!raw.personalNumber ? PersonalNumber.create(raw.personalNumber)._unsafeUnwrap() : undefined,
//                     identityCard: !!raw.identityCard ? IdentityCard.create(raw.identityCard)._unsafeUnwrap() : undefined,
//                     employeeNumber: !!raw.employeeNumber ? EmployeeNumber.create(raw.employeeNumber)._unsafeUnwrap() : undefined,
//                     organization: !!raw.organization ? Organization.create(raw.organization)._unsafeUnwrap() : undefined,
//                     rank: !!raw.rank ? Rank.create(raw.rank)._unsafeUnwrap() : undefined,
//                     akaUnit: raw.akaUnit,
//                     clearance: raw.clearance,
//                     fullClearance: raw.fullClearance,
//                     mail: !!raw.mail ? Mail.create(raw.mail)._unsafeUnwrap() : undefined,
//                     sex: raw.sex,
//                     serviceType: !!raw.serviceType ? ServiceType.create(raw.serviceType)._unsafeUnwrap() : undefined,
//                     dischargeDay: raw.dischargeDay,
//                     birthDate: raw.birthDate,
//                     jobTitle: raw.jobTitle,
//                     address: raw.address, // value
//                     phone: UniqueArray.fromArray((raw.phone || []).map((p) => Phone.create(p)._unsafeUnwrap())),
//                     mobilePhone: UniqueArray.fromArray((raw.mobilePhone || []).map((p) => MobilePhone.create(p)._unsafeUnwrap())),
//                     goalUserId: !!raw.goalUserId ? DigitalIdentityId.create(raw.goalUserId)._unsafeUnwrap() : undefined,
//                     primaryDigitalIdentityId: !!raw.primaryDigitalIdentityId
//                         ? DigitalIdentityId.create(raw.primaryDigitalIdentityId)._unsafeUnwrap()
//                         : undefined,
//                     pictures: !!raw.pictures
//                         ? {
//                               ...raw.pictures,
//                           }
//                         : undefined,
//                     createdAt: raw.createdAt, // TODO: get rid of !! ? syntax
//                 },
//                 { isNew: false, savedVersion: raw.version },
//             )._unsafeUnwrap();
//         } catch (err) {
//             console.log('err: ', err);
//         }
//         return createdEntity!;
//     }
// }
