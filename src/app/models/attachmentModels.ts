import { ILookup } from "./global/globalGeneric";

export interface ContentIndexViewModel {

  legalItemId: string,
  legalContentId: string,
  legalContentTypeId: string,
  contentName: string,
  parentId: string
  levelId: number,
  initialId: number;
  initialContentId: number,
  amendmentId: string,
  amendmentDate: string
  isDeleted: boolean
  children: ContentIndexViewModel[]
  sortOrder:string
}
export interface LegalHeaderViewModel {
  documentTypeNameEn: string;
  documentTypeNameAr: string;
  legalTypeNameEn: string;
  legalTypeNameAr: string;
  year: string;
  securityLevelEn: string;
  securityLevelAr: string;
  relatedLawId: string;
  relatedLawName: string;
  title: string;
  domainNameEn: string;
  domainNameAr: string;
  subjectNameEn: string;
  subjectNameAr: string;
  issueDate: Date
  effectiveDate: Date
  gazzetteDate: Date
  statusEn: string;
  statusAr: string;
  pusblishedDate: Date
  legalId: number
  resposiblePersonAr: string
  resposiblePersonEn: string
  statusCode: number
  initialLegalId: number;
  logo: string
  gazzatteNumber: string
  requestId: number;
  selectedTemplateId:number;
  documentTypeCode:number;
  domainId:number;
  subjectId:number;
}
export interface PreambleViewModel {
  preambleId: string
  preambleText: string
  contentTypeCode: string
  sortOrder: string
  bodyText: string
  legalItemId: string
  preambleLegalItemId: string

}

export interface ContentBodyViewModel {

  legalItemId: string,
  legalContentId: string,
  legalContentTypeId: string,
  title: string,
  body: string,
  relatedLegalItemId: string,
  relatedLegalItemText: string
  contentTypeCode: number,
  parentId: string
  amendmentId: string,
  amendmentDate: string
  children: ContentBodyViewModel[]
  initialId: number;
  initialContentId: number
  isDeleted: boolean,
  contentHistoryId: number
  sortOrder: string
}
export interface DefenseModel {
  id: number
  defenseDomainEn: string
  defenseDomainAr: string
  code: number,
  color: string,
  icon: string
  isActive: boolean
}

export interface SubjectModel {
  id: number
  subjectEn: string
  subjectAr: string
  code: number
  domainId: number
  isActive: boolean

}
export interface LegalItemViewModel {
  subjectId: Number
  year: Number
  number: Number
  title: string
  statusNameEn: string
  statusNameAr: string
  legalId: number
}

export interface LegalItemViewModels {
  totalCount: number
  legalItemBySubjectDtos: LegalItemViewModel[]

}

export interface CountriesModel {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
}

export interface LegalItemType {
  id: number;
  value: string;
  label: string;
  labelEn?: string;
  code?: string;
}


export interface DocumentType {
  id: number;
  value: string;
  label: string;
  labelEn?: string;
  code?: string;

}

export interface DropDownMasterModel {
  id: number;
  value: string;
  label: string;
  labelEn?: string;
  code?: string;
}

export interface DomainType {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
}

export interface Subjects {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
}

export interface Years {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
}

export interface SecurityLevel {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
}

export interface Status {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
}
export interface SearchResultModel {
  id: number,
  legalItemNumber: number,
  title: string,
  description: string,

  subjectId: number;
  domainId: number
  sortOrder: number;

}

export interface dataEntryUtilizationDto {
  draftCounter: number,
  waitingApprovalCounter: number,
  returnedForMofificationCounter: number,
  approvedCounter: number
}
export interface DataEntryName {
  userId: number;
  userName: string,
  userFullNameAr: string;
  userFullNameEn: string;
  isAssigned: boolean;
  dataEntryUtilizationDto: dataEntryUtilizationDto
}
export interface LegalOfficerUtilizationDto {
  assignedToResponderCounter: number,
  responseRecievedCounter: number,
  approvedCounter: number,
  returnedToResponderCounter: number
}
export interface LegalOfficerName {
  userId: number;
  userName: string,
  userFullNameAr: string;
  userFullNameEn: string;
  isAssigned: boolean;
  dataEntryUtilizationDto: LegalOfficerUtilizationDto
}

export interface DefenseDomainCount {
  defenseDomain: DefenseModel
  count: number
}
export interface DefenseSubjectCount {
  defenseSubject: SubjectModel
  count: number
}

export interface legalRequestModel {
  id?: number
  requestType?: string,
  dataEntryUserID?: string
  createdBy?: string

}



export interface LegalFormModel {
  id: number
  legalItemTypeId: number
  documentTypeId: number
  domainId: number
  defenseSubject: number
  subjectId: number
  relatedLegalItemId: number
  title: string
  legalItemVersion?: number
  number?: number
  year?: number,
  purpose: string,
  responsibleEntityId: number,
  issuingEntityId: number,
  otherIssuer?: string,
  issueDate?: string,
  effectiveDate?: string,
  officialGazetteDate?: string,
  officialGazetteNumber?: string,
  statusId: number,

  securityLevelId?: number,
  DataEntryPersonId: string,
  DataEntryPersonName?: string,
  resposibleTemplateId: number,
  attachment_file?: string,
  attachment_file_name?: string,
  legalRequestModel?: legalRequestModel,
  attachment_title?: string,
  gdmPublishDate?: string,
  status: ILookup,
  signature1?: string,
  signature2?: string,
  signature3?:string,
  signature4?:string,
  signature5?:string



}

export interface RelatedLegalItems {
  legalItemId: number
  title: string
  statusEn: string
  statusAr: string
  statusType?: string
  panelType: string | ""
  relatedLegalItemId?: number,


}


export interface SearchRelatedLegalItemResultModel {
  id: number,
  legalItemNumber: number,
  title: string,
  description?: string,
  subjectId?: number;
  domainId?: number
  sortOrder?: number;
  year: number;
  statusCode?: string;
  statusNameEn: string;
  statusNameAr: string;
  relatedLegalItemId?: number
}
export interface SearchRelatedLegalItemResultModels {
  legalItemSearchResultDtos: SearchRelatedLegalItemResultModel[]
  totalCount: number
}
export interface PreableTemplates {
  id: number;
  templateName: string;
  templateValueEn: string;
  templateValueAr: string;
  isActive:boolean
}

export interface PreableTemplates {
  id: number;
  templateName: string;
  templateValueEn: string;
  templateValueAr: string;
}


export interface IAttachment {
  id: number;
  moduleId?: string;
  fileName?: string;
  fileType?: string;
  docUrl?: string;
  itemId?: number;
  file64Bytes?: string;
  fileSize: number;
  docGUID?: string;
  createdOn?: string;
  createdBy?: string;
  updatedOn?: string;
  updatedBy?: string;
  isActive?: boolean;
  formFile?: any;
  formData?: any;
  folderURL?: string;
  createdByEmailAddress?: string;
  draftId?: string; //Internal ID for managing draft attachments which do not have module id
  moduleTypeId?: number | undefined;
  isAllowDelete?: boolean;
  chunkFileReferenceGuid?: string;
  chunkFileSize?: number;
  chunkFileTempPath?: string;
  sectionId?: number;
  componentId?: number;
}


export interface ITaskAttachments {
  id: number | 0;

  taskId: number | 0;
  isActive?: boolean;
  taskGuid?: string;
  attachmentDescription: string
  fileSize: number;
  attachment: IAttachment;
  number?: number
  otherId?: string
  file?


}

export interface RequestAttachment {

  id: number | 0,
  requestID: number | 0,
  title: string,
  fileName: string,
  fileBase64: string
}


export interface ObsAttachmentModel {
  id: number | 0,
  observationId: number | 0,
  title: string,
  fileName: string,
  fileBase64: string
}


export interface RequestAttachmentList {

  id: number | 0,
  title: string,
  fileName: string,

}

export interface RelatedLegalItems {

  legalItemId: number | 0,
  title: string,
  statusEn: string,
  statusAr: string,
  panelType: string | "",
  initialLegalId: number;
  setShowRelated

}

export interface ContentInitial {

  contentTypeId: number | 0,
  parentId: number | 0,
  title: string,
  bodyText: string,
  legalItemId: string | 0
  relatedLegalId?: number | undefined
  contentId?: number | 0
  amendementId?: number | 0
}

export interface SaveAmendmentDto {
  id?: string
  title?: string
  date?: string
  fileName?: string
  fileBase64String?: string
  legalIntialItemId?: string | "";
}




export interface UpdateAmendDto {


  initialLegalId: string
  contentId: string
  amendmentId: string
  newText: string
}

export interface AmendmentHistory {
  amendmentId: number
  amendmentDate: string
  contentId: number
  parentId: number
  bodyText: string
  contentHistoryId: number
  initialId: number;
  title: string;
}

export interface legalItemInitialLogDetailsList {
  id: number
  legalItemInitialLog: string
  legalItemInitialLogId: number | null
  legalItemContentInitialId: number | null
  highlightedText: string | null,
  remarks: string | null
}



export interface LegalItemInitialLogsModel {
  id: number
  remarks: string
  status: string
  statusId: number
  statusLookupName: string
  statusLookupNameAr: string
  createdBy: string
  createdDate: string
  userFullNameAr?: string
  userFullNameEn?: string
  legalItemInitialLogDetailsList: legalItemInitialLogDetailsList[],
  assignedUserFUllName?: string,
  assignedUser?: string
}



export interface LegalItemDetailsModel {
  id: null,
  remarks: null,
  status: null,
  statusId: 0,
  statusEn: string,
  statusAr: string,
  documentType: null,
  documentTypes: null,
  documentTypeEn: string,
  documentTypeAr: string,
  legalItemType: null,
  legalItemTypes: null,
  legalItemTypeEn: string,
  legalItemTypeAr: string,
  defenseSubject: null,
  defenseSubjects: null,
  title: string,
  number?: number,
  year?: number,
  legalItemVersion?: number,
  purpose: string,
  defenseSubjectEn: string,
  defenseSubjectAr: string,
  responsibleEntityEn: string,
  responsibleEntityAr: string,
  relatedLegalItemTitle: string,
  issuingEntityEn: string,
  issuingEntityAr: string,
  otherIssuer?: string,
  securityLevelEn: string,
  securityLevelAr: string,
  responsibleEntity: null,
  responsibleEntityId: null,
  issuingEntity: null,
  securityLevel: null,
  preambleTemplate: null,
  preambleTemplateId: null,
  issueDate?: string,
  effectiveDate: string,
  officialGazetteDate?: string,
  officialGazetteNumber?: string,
  dateEntryNameAr: string,
  dateEntryNameEn: string,
  gdmPublishDate?: string,
  createdBy: string,
  createdDate: string,
  dataEntryUsername?: string,
  legalRequestId?: null,
  requestCreatedBy?: string,
  userId: number

}




export interface LogDetailsModel {

  initialLegalId: number,
  remarks: string,
  legalItemContentEditLogDetails: [
    {
      editLogDetailsId: number
      contentId: number,
      highlitedtext: string,
      remarks: string
    }
  ]
}

export interface LegalItemVersionsLookups {
  id: string;
  en: string;
  ar: string;
}



export interface FatwaForm {
  id?: number
  title: string,
  defenceDomainId?: number,
  subjectId?: number,
  legalItemId?: number,
  contentId?: number,
  question?: string,
  remarks?: string,
  statusId: number,
  legalItemContentTitle?: string
  employee?:string
}

export interface FatwaFormDetails {
  id: number,
  title?: string,
  defenceDomainId: number,
  subjectId: number,
  legalItemId?: number,
  contentId?: number,
  contentTitle?:string,
  question: string,
  remarks: string,
  fatwaStatus: {
    id: 1,
    lookupName: string,
    lookupNameAr: string,
    lookupId:number
  },
  statusId: number,
  isPublished: false,
  creatorUnitId: null,
  assignedUser: null,
  defenseDomain:DefenseModel,
  subject:SubjectModel,
  legalItemTitle:string,
  createdDate:string,
  lastUpdatedDate:string
  response:string
  receivedUser:string
  createdUser:string
  employee:string
}


export interface FatwaAttachmentModel {
  id: number | 0,
  fatwaId: number | 0,
  title: string,
  fileName: string,
  fileBase64: string
}

// export interface RequestAttachmentList {

//   id: number | 0,
//   title: string,
//   fileName: string,
//   fatwaId

// }


export interface DirectorForm {
  id?: number
  textbox1: string,
  textbox2?: string,
  textbox3?: string,
  textbox4?: string, 
}

export interface LegalArticleTitle {

  id: number | 0,
  title: string,

}

export interface CommentForm {
  id?: number
  title: string,
  comment?: string,
  legalItemId: number,
  statusId: number  
}


export interface CommentAttachmentModel {
  id: number | 0,
  commentId: number | 0,
  title: string,
  fileName: string,
  fileBase64: string
}


export interface CommentFormDetails {
  id: number,
  title?: string,
  defenceDomainId: number,
  subjectId: number,
  legalItemId?: number, 
  comment: string,
  commentStatus: {
    id: 1,
    lookupName: string,
    lookupNameAr: string,
    lookupType:string,
    lookupId:number
  },
  statusId: number,
  isPublished: false,
  creatorUnitId: null,
  assignedUser: null,
  legalItemTitle:string,
  createdDate:string,
  createdUser:string

}






