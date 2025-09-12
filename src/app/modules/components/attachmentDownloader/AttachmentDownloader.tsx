import { Tooltip } from "@mui/material";
import { DetailLabels } from "../common/formsLabels/detailLabels";
import { useState } from "react";
import axios from "axios";


const ManageTooltipTitle = ({ title }) => {
    return (
        <div className="txt-trim-content">
            <span className="txt-name"><DetailLabels text={title.toString()} isI18nKey={true} /></span>
        </div>
    );
};


type attchmentType = 'Fatwa' | 'Comments' | 'Law';

export const AttachmentDownloader = (props: {
    item, attchmentType: attchmentType
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleView = async (requestAttachmentId) => {
        try {
            var response;
            setIsLoading(true);

            if (props.attchmentType === 'Fatwa') {
                response = await axios.get(process.env.REACT_APP_API_URL + `/Attachment/GetFatwaAttachmentById?attachmentID=${requestAttachmentId}`, {
                    responseType: 'blob',
                });
            }

            if (props.attchmentType === 'Comments') {
                response = await axios.get(process.env.REACT_APP_API_URL + `/Attachment/GetCommentAttachment?requestAttachmentId=${requestAttachmentId}`, {
                    responseType: 'blob',
                });
            }


            if (props.attchmentType === 'Law') {
                response = await axios.get(process.env.REACT_APP_API_URL + `/Attachment/GetRequestAttachment?requestAttachmentId=${requestAttachmentId}`, {
                    responseType: 'blob',
                })
            }

            const disposition = response.headers['Content-Disposition'];
            let fileName = 'download-file';
            if (disposition && disposition.includes('filename=')) {
                setIsLoading(false);
                const filenameRegex = /filename=?([^"]+)"?/;
                const maches = filenameRegex.exec(disposition);
                if (maches != null && maches[1]) {
                    fileName = maches[1]
                }
            }
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setIsLoading(false);

            //FETCH LOOKUP VALUES FOR DROPDOWNS GetDocumentTypeMaster
            // dispatch(GetRequestAttachment({
            //     requestAttachmentId: requestAttachmentId
            // }))
            //     .then(unwrapResult)
            //     .then((originalPromiseResult) => {
            //         if (originalPromiseResult.statusCode === 200) {
            //             setisViewLoading(false);
            //             setLoadingIndex(null);


            //             let base64 = originalPromiseResult.data.fileBase64;
            //             let fileId = originalPromiseResult.data.id;
            //             let fileName = originalPromiseResult.data.fileName;



            //             handleDownload(base64, fileName, fileId);


            //         }
            //         if (originalPromiseResult.statusCode === 401)
            //             setisViewLoading(false);
            //         setLoadingIndex(null);

            //         console.log("GetDocumentTypeMaster Api call Failed");
            //     })
            //     .catch((rejectedValueOrSerializedError) => {
            //         setisViewLoading(false);
            //         setLoadingIndex(null);

            //         console.log(rejectedValueOrSerializedError);
            //     });


        } catch (e) {
            console.log("GetDocumentTypeMaster Api call Failed");
            setIsLoading(false);
        }
        return undefined;

    }

    return (<>

        <div>
            <span>  {isLoading == false ?

                <>
                    <Tooltip
                        placement="bottom"
                        title={<ManageTooltipTitle title={'LEGAL.ATTACHMENTS.TOOLTIP.VIEW'} />}
                        arrow
                        TransitionProps={{ timeout: 400 }}
                    >
                        {
                            <i className="fa fa-light fa-outline fa-download fs-3 text-gray pointer" onClick={() => handleView(props.item.id)} />
                        }
                    </Tooltip></> : null}

            </span>
            {isLoading === true && (
                <span className='indicator-progress' style={{ display: 'block' }}>

                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>)}
            <a id={"dwnldLnk_" + props.item.id} download={props.item.fileName} hidden={true} />
        </div>

    </>);
};