//GetIndexTree

import { createAsyncThunk } from "@reduxjs/toolkit";
import { responseType } from "../../models/global/responseResult";
import { requests } from "../../helper/axiosInterceptor";
import { ObsAttachmentModel, RequestAttachment } from "../../models/attachmentModels";


export const UploadRequestAttachment = createAsyncThunk<any, { attachmentObject: RequestAttachment }>(
  'Attachment/UploadRequestAttachment',
  async ({ attachmentObject }, thunkApi) => {
    try {
      return await requests.post<responseType>(`Attachment/UploadRequestAttachment`, { ...attachmentObject });
    } catch (error: any) {
      console.log(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);


//requestAttachment
export const UploadObservationAttachment = createAsyncThunk<any, { attachmentObject: ObsAttachmentModel }>(
  'Attachment/UploadObservationAttachment',
  async ({ attachmentObject }, thunkApi) => {
    try {
      return await requests.post<responseType>(`Attachment/UploadObservationAttachment`, { ...attachmentObject });
    } catch (error: any) {
      console.log(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);


export const GetRequestAttachments = createAsyncThunk<any, { observationAttachmentId }>(
  'Attachment/GetRequestAttachments',
  async ({ observationAttachmentId }, thunkApi) => {
    try {
      return await requests.get<responseType>(`/Attachment/GetRequestAttachments?observationAttachmentId=${observationAttachmentId}`);
    } catch (error: any) {
      console.log(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const GetRequestAttachment = createAsyncThunk<any, { observationAttachmentId }>(
  'Attachment/GetRequestAttachments',
  async ({ observationAttachmentId }, thunkApi) => {
    try {
      return await requests.get<responseType>(`/Attachment/GetRequestAttachment?observationAttachmentId=${observationAttachmentId}`);
    } catch (error: any) {
      console.log(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);


//RemovePreambleInitial
export const DeleteRequestAttachment = createAsyncThunk<any, { observationAttachmentId }>(
  'Attachment/DeleteRequestAttachment',
  async ({ observationAttachmentId }, thunkApi) => {
    try {
      return await requests.delete<responseType>(`/Attachment/UploadObservationAttachmentFromForm=${observationAttachmentId}`);
    } catch (error: any) {
      console.log(error);
      return thunkApi.rejectWithValue(error);
    }
  }
);
