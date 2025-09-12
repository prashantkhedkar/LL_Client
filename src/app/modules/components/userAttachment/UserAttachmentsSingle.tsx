import { useIntl } from "react-intl";
import { Checkbox } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { MIMEConstantType, generateUUID, getAllowedMimeTypes } from "../../utils/common";
import { toast } from "react-toastify";
import { addAttachmentItemAsync, deleteAttachmentAsync, downloadAttachmentAsync, fetchAttachmentListAsync, globalActions } from "../../services/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import "./UserAttachments.css";
import { IAttachment } from "../../../models/global/globalGeneric";
import { unwrapResult } from "@reduxjs/toolkit";
import MIMEConstant from "../../../helper/_constant/mime.constant";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { LabelTitleSemibold1, LabelTitleSemibold2 } from "../common/formsLabels/detailLabels";
// import { ErrorMessage } from '@hookform/error-message';


import { color, fontFamily, fontSize } from "@mui/system";
interface props {
  allowMultipleFileUpload?: boolean,
  showCheckbox?: boolean,
  loadedfileName?: string,
  register?,
  showUpload?: boolean,
  initialData: IAttachment[]; // Input
  recordId: number;
  moduleTypeId?: number; // Refer to Global Generics for Enum constant
  onFileSave?: Function;
  onFileRemove?: Function;
  fileTypes?: MIMEConstantType;
  title: string
  tempguid: string
  userAttachment
  moduleId: number,
  required?: boolean,
  isAttachmentEmpty?,
  guid?
  count?
  errors
  showfile?,
  perFileMaxAllowedSizeInMb?: number
  isAttachmentSizeError?,
  isAttachmentTypeError?,
  showType?
  SetData?,
  setCurrentFile
}





  const UserAttachmentsSingle = ({ errors, SetData, initialData, isAttachmentEmpty, recordId, showCheckbox, loadedfileName, register, showUpload, moduleTypeId,
     fileTypes, title, tempguid, userAttachment, moduleId, required, guid, count, showfile, perFileMaxAllowedSizeInMb = 10, 
     showType = false,isAttachmentSizeError,isAttachmentTypeError,setCurrentFile }: props) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [fileName, setFileName] = useState(loadedfileName)

  const [uniqueName, setUniqueName] = useState(tempguid)
  const [fileSizeTypeWarning, setFileSizeTypeWarning] = useState<string>('');
  useEffect(() => {

    const handleReset = () => {
      setFileName("")
      if (inputFile.current) {
        inputFile.current.value = ""
        inputFile.current.type = "text ";
        inputFile.current.type = "file";

      }


    };
    console.log("countcount" + count)
    if (count && count !== undefined && count !== 0) {
      handleReset()
    }
    loadAttachmentDisclaimer()
  }, [count])

  const loadAttachmentDisclaimer = () => {
    let listOfExtensions: string = getAllowedMimeTypes(true, fileTypes!, intl.formatMessage({ id: 'MOD.GLOBAL.FILEUPLOAD.FILESIZE.INFOMESSAGE' }), perFileMaxAllowedSizeInMb).generalMsg;
    setFileSizeTypeWarning(listOfExtensions);
    isAttachmentTypeError(listOfExtensions);
    return listOfExtensions;
  };

  const SendDataAttachmentStatus = (selectedFiles) => {
    console.log("Sending data attachment status...");
    console.log(selectedFiles);
    isAttachmentEmpty(selectedFiles);

  }



  const getBase64 = (file) => {
    return new Promise(resolve => {
      let baseURL: string | ArrayBuffer | null;
      // Make new FileReader
      let reader = new FileReader();
      // Convert the file to base64 text
      reader.readAsDataURL(file);
      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };
  const inputFile = useRef<HTMLInputElement>();


  function isGraterThanGivenSize(bytes) {
    return bytes / (1024 * 1024) > perFileMaxAllowedSizeInMb;
  }


  const handleOnSelectFileForUpload = (event: React.ChangeEvent<HTMLInputElement>, name) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    console.log("On file Selected");
    
    setCurrentFile(event.target.files ? event.target.files[0] : undefined);
    SendDataAttachmentStatus(selectedFiles);

    //Check single file Size

    if (files) {
      
      let fileSize = files[0]['size'];

      if (fileSize) {

        if (isGraterThanGivenSize(fileSize)) {
          console.log("File is Grater Than Givent Size");
          isAttachmentSizeError(true);
    
        }else{
          isAttachmentSizeError(false);
        }

      }
      console.log(fileSize);

    }



    Array.from(selectedFiles).forEach(file => {

      // if (fileTypes) {
      //   const result = fileTypes.filter((item) => item === file.type);
      //   if (result.length === 0) {
      //     toast.warning(intl.formatMessage({ id: 'MOD.GLOBAL.FILEUPLOAD.FILETYPE.MESSAGE' }));
      //     return;
      //   }
      // } else {
      //   const result = MIMEConstant.filter((item) => item === file.type);
      //   if (result.length === 0) {
      //     toast.warning(intl.formatMessage({ id: 'MOD.GLOBAL.FILEUPLOAD.FILETYPE.MESSAGE' }));
      //     return;
      //   }
      // }
      if (fileTypes) {
        let _fInfoMessage = intl.formatMessage({ id: 'MOD.GLOBAL.FILEUPLOAD.FILETYPE.INFOMESSAGE' });
        ;
        // Assuming you want to join the keys (MIME types) of the object
        const mimeTypes = Object.keys(fileTypes);
        const fileTypesString = mimeTypes.join(', ');

        // Check if fileTypesString is a valid string
        if (typeof fileTypesString === 'string') {
          // Assuming you have a specific MIME type
          const specificMimeType = file.type;

          // Get the file extension based on the specific MIME type
          const fileExtension = fileTypes[specificMimeType];

          if (!fileExtension) {
            
            _fInfoMessage = _fInfoMessage.replace("{X}", getAllowedMimeTypes(true, fileTypes, intl.formatMessage({ id: 'MOD.GLOBAL.FILEUPLOAD.FILESIZE.INFOMESSAGE' }), perFileMaxAllowedSizeInMb).extension);
            toast.warning(_fInfoMessage);
            isAttachmentTypeError({"status":true,message:_fInfoMessage});
            return fileExtension; // Return the file extension
          }
        }

      }


      getBase64(file).then((response: any) => {
        setFileName(file.name);
        let formDataModel: IAttachment = {
          formFile: response,
          fileName: file.name,
          fileType: file.type,
          isActive: true,
          id: recordId,
          moduleId: moduleId.toString(),
          draftId: name,
          createdByEmailAddress: "",
          moduleTypeId: moduleTypeId,
          file:file,
          docGUID: guid,
          fileSize: 0
        };
        if (moduleTypeId === 1)
          dispatch(globalActions.updateUserAttachment({ data: formDataModel, action: 'new' }));
        SetData(formDataModel);

        toast.dismiss('LoadingToastr' + file.name.replaceAll(' ', '_').toString());
        // toast.info(intl.formatMessage({ id: 'MOD.GLOBAL.FILEUPLOAD.UPLOADING.MESSAGE' }));
      })
    })
  }
  function downlaodFiles() {

  }

  return (
    <>
      {/* {showType &&
        <LabelTitleSemibold2 text={title} customHint={<FileTypesDisplay customText={fileSizeTypeWarning} customStyle={{ font: "var(--small-medium)" }} />} />
      } */}
      {!showType &&
        <LabelTitleSemibold2 text={title} />
      }
      <div className="file-upload ">
        {

          <div className="single-fileUpload">
            <input id={tempguid} type='file' multiple={false} key={count}
              ref={inputFile}
              {...register(tempguid, {
                required: required ? intl.formatMessage({ id: title }) + " " + intl.formatMessage({ id: 'FORM.LABEL.REQUIRED' }) : false,
              })}

              onChange={(e) => handleOnSelectFileForUpload(e, uniqueName)} hidden={true} />
            <div hidden={!showUpload} className="file-upload-button float-start">
              <label htmlFor={tempguid} style={{ cursor: 'pointer' }}>
                <img src={toAbsoluteUrl("/media/svg/mod-specific/icon-upload.svg")} className="float-start"></img>
                <div className="single-fileUpload-label float-start ps-2">{intl.formatMessage({ id: 'FORM.FILEMANAGEMENT.UPLOADFILE' })}</div>

              </label>
            </div>

            {
              <span className="float-start pt-2 ps-2">{fileName}</span>

            }

            {loadedfileName && loadedfileName?.length > 0 &&
              <div className="row ">
                <div className="col pb-4">
                  <div className="float-end">

                  </div>
                </div>
              </div>
            }

            {showfile && showfile !== "" &&
              <div className="row ">
                <div className="col pb-4">
                  <div className="float-end">
                    {showfile}
                  </div>
                </div>
              </div>
            }

          </div>


        }

      </div>


    </>
  );
}

export default UserAttachmentsSingle