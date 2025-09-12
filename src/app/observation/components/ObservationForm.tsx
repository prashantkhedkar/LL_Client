import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { useLang } from '../../../_metronic/i18n/Metronici18n';
import { InfoLabels } from '../../modules/components/common/formsLabels/detailLabels';
import DropdownList from "../../modules/components/dropdown/DropdownList";
import { writeToBrowserConsole } from "../../modules/utils/common";
import { unwrapResult } from "@reduxjs/toolkit";
import { ILookup } from "../../models/global/globalGeneric";
import { GetLookupValues } from "../../modules/services/adminSlice";
import { useAppDispatch } from "../../../store";
import { useAuth } from "../../modules/auth";

interface ObservationFormProps {
  onSubmit: (values: ObservationFormData) => void;
  initialValues?: ObservationFormData;
  mode?: "add" | "edit";
  formikRef?: React.MutableRefObject<any>;
}

export interface ObservationFormData {
  observationSubject: string;
  observationTitle: string;
  discussion: string;
  conclusion: string;
  initialRecommendation: string;
  observationType: number;
  originatingType: number;
  level: number;
  originatingMainUnit: number;
  status: number;
}

const ObservationForm: React.FC<ObservationFormProps> = ({
  onSubmit,
  initialValues,
  mode = "add",
  formikRef,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [typeOptions, setTypeOptions] = useState<ILookup[]>([]);
  const [levelOptions, setLevelOptions] = useState<ILookup[]>([]);
  const intl = useIntl();
  const lang = useLang();
  const dispatch = useAppDispatch();
  const { auth } = useAuth();
  useEffect(() => {
    auth && console.log("Current User in ObservationForm: ", auth);
    // Load Observation Types
    dispatch(GetLookupValues({ lookupType: "ObservationType" }))
      .then(unwrapResult)
      .then((originalPromiseResult) => {
        if (originalPromiseResult.statusCode === 200) {
          const response: ILookup[] = originalPromiseResult.data;
          setTypeOptions(response);
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        writeToBrowserConsole(rejectedValueOrSerializedError);
      });

    // Load Observation Level options
    dispatch(GetLookupValues({ lookupType: "Level" }))
      .then(unwrapResult)
      .then((originalPromiseResult) => {
        if (originalPromiseResult.statusCode === 200) {
          const response: ILookup[] = originalPromiseResult.data;
          setLevelOptions(response);
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        writeToBrowserConsole(rejectedValueOrSerializedError);
      });
  }, [dispatch]);

  const validationSchema = Yup.object({
    observationTitle: Yup.string()
      .required(
        intl.formatMessage({ id: "VALIDATION.OBSERVATION.TITLE.REQUIRED" })
      )
      .max(
        256,
        intl.formatMessage({ id: "VALIDATION.OBSERVATION.TITLE.MAX_LENGTH" })
      ),
    observationSubject: Yup.string()
      .required(
        intl.formatMessage({ id: "VALIDATION.OBSERVATION.SUBJECT.REQUIRED" })
      )
      .max(
        256,
        intl.formatMessage({ id: "VALIDATION.OBSERVATION.SUBJECT.MAX_LENGTH" })
      ),
    discussion: Yup.string()
      .required(intl.formatMessage({ id: "VALIDATION.DISCUSSION.REQUIRED" }))
      .max(50, "Discussion must be less than 50 characters"),
    conclusion: Yup.string()
      .required(intl.formatMessage({ id: "VALIDATION.CONCLUSION.REQUIRED" }))
      .max(50, "Conclusion must be less than 50 characters"),
    initialRecommendation: Yup.string()
      .required(
        intl.formatMessage({ id: "VALIDATION.INITIAL.RECOMMENDATION.REQUIRED" })
      )
      .max(50, "Initial recommendation must be less than 50 characters"),
    type: Yup.string()
      .required(intl.formatMessage({ id: "VALIDATION.TYPE.REQUIRED" }))
      .max(64, intl.formatMessage({ id: "VALIDATION.TYPE.MAX_LENGTH" })),
    level: Yup.string()
      .required(intl.formatMessage({ id: "VALIDATION.LEVEL.REQUIRED" }))
      .max(64, intl.formatMessage({ id: "VALIDATION.LEVEL.MAX_LENGTH" })),
    originatingMainUnit: Yup.string()
      .required(
        intl.formatMessage({ id: "VALIDATION.ORIGINATING.MAIN.UNIT.REQUIRED" })
      )
      .max(
        128,
        intl.formatMessage({
          id: "VALIDATION.ORIGINATING.MAIN.UNIT.MAX_LENGTH",
        })
      ),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      observationSubject: "",
      observationTitle: "",
      discussion: "",
      conclusion: "",
      initialRecommendation: "",
      observationType: 0,
      originatingType: 0,
      level: 0,
      originatingMainUnit: 0,
      status: 0,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await onSubmit(values);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Expose formik instance to parent component
  if (formikRef) {
    formikRef.current = formik;
  }

  return (
    <form onSubmit={formik.handleSubmit} className="article-form rtl-form">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.OBSERVATION.TITLE" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-10">
              <input
                type="text"
                autoComplete="off"
                className="form-control form-control-solid active input5 lbl-txt-medium-2"
                placeholder={intl.formatMessage({
                  id: "PLACEHOLDER.OBSERVATION.TITLE",
                })}
                {...formik.getFieldProps("observationTitle")}
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              {formik.touched.observationTitle &&
                formik.errors.observationTitle && (
                  <div className="error">{formik.errors.observationTitle}</div>
                )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.OBSERVATION.SUBJECT" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-10">
              <input
                type="text"
                autoComplete="off"
                placeholder={intl.formatMessage({
                  id: "PLACEHOLDER.OBSERVATION.SUBJECT",
                })}
                className="form-control form-control-solid active input5 lbl-txt-medium-2"
                {...formik.getFieldProps("observationSubject")}
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              {formik.touched.observationSubject &&
                formik.errors.observationSubject && (
                  <div className="error">
                    {formik.errors.observationSubject}
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.TYPE" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-4">
              <DropdownList
                dataKey="lookupId"
                dataValue={lang === "ar" ? "lookupNameAr" : "lookupName"}
                defaultText={intl.formatMessage({
                  id: "PLACEHOLDER.SELECT.TYPE",
                })}
                value={formik.values.observationType}
                data={typeOptions}
                setSelectedValue={(value) =>
                  formik.setFieldValue("observationType", value)
                }
              />
              {formik.touched.observationType &&
                formik.errors.observationType && (
                  <div className="error">{formik.errors.observationType}</div>
                )}
            </div>
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.LEVEL" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-4">
              <DropdownList
                dataKey="lookupId"
                dataValue={lang === "ar" ? "lookupNameAr" : "lookupName"}
                defaultText={intl.formatMessage({
                  id: "PLACEHOLDER.SELECT.LEVEL",
                })}
                value={formik.values.level}
                data={levelOptions}
                setSelectedValue={(value) =>
                  formik.setFieldValue("level", value)
                }
              />
              {formik.touched.level && formik.errors.level && (
                <div className="error">{formik.errors.level}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="row">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.DISCUSSION" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-10">
              <textarea
                className="form-control"
                placeholder={intl.formatMessage({
                  id: "PLACEHOLDER.DISCUSSION",
                })}
                {...formik.getFieldProps("discussion")}
                rows={4}
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              {formik.touched.discussion && formik.errors.discussion && (
                <div className="error">{formik.errors.discussion}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="row">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.CONCLUSION" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-10">
              <textarea
                className="form-control"
                placeholder={intl.formatMessage({
                  id: "PLACEHOLDER.CONCLUSION",
                })}
                {...formik.getFieldProps("conclusion")}
                rows={4}
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              {formik.touched.conclusion && formik.errors.conclusion && (
                <div className="error">{formik.errors.conclusion}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="row">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({
                  id: "LABEL.INITIAL.RECOMMENDATION",
                })}
                isRequired={true}
              />
            </div>
            <div className="col-md-10">
              <textarea
                className="form-control"
                placeholder={intl.formatMessage({
                  id: "PLACEHOLDER.INITIAL.RECOMMENDATION",
                })}
                {...formik.getFieldProps("initialRecommendation")}
                rows={4}
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              {formik.touched.initialRecommendation &&
                formik.errors.initialRecommendation && (
                  <div className="error">
                    {formik.errors.initialRecommendation}
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="col-12 mb-4">
          <div className="row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.ORIGINATING.MAIN.UNIT" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-solid active input5 lbl-txt-medium-2"
                placeholder={intl.formatMessage({
                  id: "PLACEHOLDER.ORIGINATING.MAIN.UNIT",
                })}
                {...formik.getFieldProps("originatingMainUnit")}
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              {formik.touched.originatingMainUnit &&
                formik.errors.originatingMainUnit && (
                  <div className="error">
                    {formik.errors.originatingMainUnit}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ObservationForm;
