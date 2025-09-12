import { useIntl } from "react-intl";
import { useLang } from "../../../_metronic/i18n/Metronici18n";
import { useState } from "react";
import { useAppDispatch } from "../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import { DetailLabels } from "../../modules/components/common/formsLabels/detailLabels";
import axios from "axios";
import { AttachmentDownloader } from "../../modules/components/attachmentDownloader/AttachmentDownloader";

export const ObservationAttachment = (props: {
  observationId;
  AttachmentList;
  isLoading;
}) => {
  const intl = useIntl();
  const lang = useLang();
  const [isViewLoading, setisViewLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const dispatch = useAppDispatch();

  const ManageTooltipTitle = ({ title }) => {
    return (
      <div className="txt-trim-content">
        <span className="txt-name">
          <DetailLabels text={title.toString()} isI18nKey={true} />
        </span>
      </div>
    );
  };

  const handleDownload = (base64String, fileName, id) => {
    try {
      let anchorRef = document.getElementById(
        "dwnldLnk_" + id
      ) as HTMLAnchorElement;
      anchorRef.href = base64String;
      anchorRef.click();
      setisViewLoading(false);
      toast.success(
        intl.formatMessage({ id: "MOD.GLOBAL.FILEDOWNLOAD.SUCCESS.MESSAGE" })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleView = async (requestAttachmentId) => {
    try {
      setisViewLoading(true);
      setLoadingIndex(requestAttachmentId);
      const response = await axios.get(
        process.env.REACT_APP_API_URL +
          `/Attachment/GetFatwaAttachmentById?attachmentID=${requestAttachmentId}`,
        {
          responseType: "blob",
        }
      );

      const disposition = response.headers["Content-Disposition"];
      let fileName = "download-file";
      if (disposition && disposition.includes("filename=")) {
        const filenameRegex = /filename=?([^"]+)"?/;
        const maches = filenameRegex.exec(disposition);
        if (maches != null && maches[1]) {
          fileName = maches[1];
        }
      }
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setisViewLoading(false);
      setLoadingIndex(null);
    } catch (e) {
      console.log("GetDocumentTypeMaster Api call Failed");
      setisViewLoading(false);
      setLoadingIndex(null);
    }
    return undefined;
  };

  return (
    <>
      <div className="row  mb-4 p-2 align-items-center law-form-logs-holder">
        <div className="col-12 ">
          {/* {props.AttachmentList.length === 0 && props.isLoading === false ? <NoRecordsAvailable /> : null} */}

          {props.AttachmentList && props.AttachmentList.length > 0 ? (
            <div className="row row py-5  attachment-table-header">
              <div className="col">
                <span>
                  {" "}
                  {intl.formatMessage({
                    id: "LEGAL.FORM.ATTACHMENT.TAB.ATTACHMENT.TITLE",
                  })}{" "}
                </span>
              </div>
              <div
                className="col"
                style={{
                  paddingRight: lang == "ar" ? "300px" : "0px",
                  paddingLeft: lang == "en" ? "300px" : "0px",
                }}
              >
                <div className="text-start">
                  {" "}
                  <span>
                    {" "}
                    {intl.formatMessage({
                      id: "LEGAL.FORM.ATTACHMENT.TAB.FILENAME",
                    })}{" "}
                  </span>
                </div>
              </div>
              <div className="col">
                <div className="text-end">
                  {" "}
                  <span>
                    {" "}
                    {intl.formatMessage({
                      id: "LEGAL.FORM.ATTACHMENT.TAB.ACTION",
                    })}{" "}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {props.AttachmentList &&
            props.AttachmentList.length > 0 &&
            props.AttachmentList.map((item) => (
              <>
                <div className="row  py-5 attachment-table-border-row     justify-content: start;">
                  <div className="col">
                    <div>
                      {" "}
                      <span>{item.title}</span>
                    </div>
                  </div>
                  <div
                    className="col"
                    style={{
                      paddingRight: lang == "ar" ? "300px" : "0px",
                      paddingLeft: lang == "en" ? "300px" : "0px",
                    }}
                  >
                    <div className="">
                      {" "}
                      <span>{item.fileName}</span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="d-flex gap-5 flex-end">
                      <div>
                        <AttachmentDownloader
                          item={item}
                          attchmentType={"Fatwa"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}

          {props.isLoading === true ? <div className="my-2"></div> : null}
        </div>
      </div>
    </>
  );
};
