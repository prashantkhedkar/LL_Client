import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { useLang } from '../../../../../_metronic/i18n/Metronici18n';
import { InfoLabels } from '../../../../modules/components/common/formsLabels/detailLabels';
import DropdownList from '../../../../modules/components/dropdown/DropdownList';
import PageHeader from '../../../../modules/components/common/PageHeader/PageHeader';
import ContentSection from '../../../../modules/components/common/ContentSection/ContentSection';
import { BtnLabeltxtMedium2, BtnLabelCanceltxtMedium2 } from '../../../../modules/components/common/formsLabels/detailLabels';

interface ArticleFormProps {
  onSubmit: (values: ArticleFormData) => void;
  initialValues?: ArticleFormData;
  mode?: 'add' | 'edit';
}

export interface ArticleFormData {
  observationSubject: string;
  observationTitle: string;
  discussion: string;
  conclusion: string;
  initialRecommendation: string;
  type: string; // Issue / Good Practice / Suggestion / Risk / Opportunity
  originatingMainUnit: string; // System generated
  originatingSubunit: string;
  submittedBy: string; // System generated
  submittedDate: Date; // System generated
  approvedBy: string; // Auto-assigned
  currentAssignment: string;
  status: string; // Draft, Archived, Published
  submissionStatus: string; // Draft/Submitted
  attachments?: File[];
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, initialValues, mode = 'add' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  const lang = useLang();


  const validationSchema = Yup.object({
    observationTitle: Yup.string()
      .required(intl.formatMessage({ id: 'VALIDATION.OBSERVATION.TITLE.REQUIRED' }))
      .max(256, intl.formatMessage({ id: 'VALIDATION.OBSERVATION.TITLE.MAX_LENGTH' })),
    observationSubject: Yup.string()
      .required(intl.formatMessage({ id: 'VALIDATION.OBSERVATION.SUBJECT.REQUIRED' }))
      .max(256, intl.formatMessage({ id: 'VALIDATION.OBSERVATION.SUBJECT.MAX_LENGTH' })),
    discussion: Yup.string()
      .required(intl.formatMessage({ id: 'VALIDATION.DISCUSSION.REQUIRED' })),
    conclusion: Yup.string()
      .required(intl.formatMessage({ id: 'VALIDATION.CONCLUSION.REQUIRED' })),
    initialRecommendation: Yup.string()
      .required(intl.formatMessage({ id: 'VALIDATION.INITIAL.RECOMMENDATION.REQUIRED' })),
    type: Yup.string()
      .required(intl.formatMessage({ id: 'VALIDATION.TYPE.REQUIRED' }))
      .max(64, intl.formatMessage({ id: 'VALIDATION.TYPE.MAX_LENGTH' })),
    originatingMainUnit: Yup.string()
      .required(intl.formatMessage({ id: 'VALIDATION.ORIGINATING.MAIN.UNIT.REQUIRED' }))
      .max(128, intl.formatMessage({ id: 'VALIDATION.ORIGINATING.MAIN.UNIT.MAX_LENGTH' })),
    originatingSubunit: Yup.string()
      .required(intl.formatMessage({ id: 'VALIDATION.ORIGINATING.SUBUNIT.REQUIRED' }))
      .max(128, intl.formatMessage({ id: 'VALIDATION.ORIGINATING.SUBUNIT.MAX_LENGTH' })),
    currentAssignment: Yup.string()
      .required(intl.formatMessage({ id: 'VALIDATION.CURRENT.ASSIGNMENT.REQUIRED' }))
      .max(128, intl.formatMessage({ id: 'VALIDATION.CURRENT.ASSIGNMENT.MAX_LENGTH' })),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      observationSubject: '',
      observationTitle: '',
      discussion: '',
      conclusion: '',
      initialRecommendation: '',
      type: '',
      originatingMainUnit: '',
      originatingSubunit: '',
      submittedBy: '',
      submittedDate: new Date(),
      approvedBy: '',
      currentAssignment: '',
      status: '',
      submissionStatus: '',
      attachments: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await onSubmit(values);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const typeOptions = [
    { lookupId: 'issue', lookupNameAr: intl.formatMessage({ id: 'OPTION.ISSUE' }), lookupName: 'Issue' },
    { lookupId: 'good-practice', lookupNameAr: intl.formatMessage({ id: 'OPTION.GOOD_PRACTICE' }), lookupName: 'Good Practice' },
    { lookupId: 'suggestion', lookupNameAr: intl.formatMessage({ id: 'OPTION.SUGGESTION' }), lookupName: 'Suggestion' },
    { lookupId: 'risk', lookupNameAr: intl.formatMessage({ id: 'OPTION.RISK' }), lookupName: 'Risk' },
    { lookupId: 'opportunity', lookupNameAr: intl.formatMessage({ id: 'OPTION.OPPORTUNITY' }), lookupName: 'Opportunity' },
  ];

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
                autoComplete='off'
                className="form-control form-control-solid active input5 lbl-txt-medium-2"
                placeholder={intl.formatMessage({
                  id: "LABEL.OBSERVATION.TITLE",
                })}
                {...formik.getFieldProps('observationTitle')}
                dir="rtl"
              />
              {formik.touched.observationTitle && formik.errors.observationTitle && (
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
                autoComplete='off'
                 className="form-control form-control-solid active input5 lbl-txt-medium-2"
                {...formik.getFieldProps('observationSubject')}
                dir="rtl"
              />
              {formik.touched.observationSubject && formik.errors.observationSubject && (
                <div className="error">{formik.errors.observationSubject}</div>
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
                {...formik.getFieldProps('discussion')}
                rows={4}
                dir="rtl"
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
                {...formik.getFieldProps('conclusion')}
                rows={4}
                dir="rtl"
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
                text={intl.formatMessage({ id: "LABEL.INITIAL.RECOMMENDATION" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-10">
              <textarea
                className="form-control"
                {...formik.getFieldProps('initialRecommendation')}
                rows={4}
                dir="rtl"
              />
              {formik.touched.initialRecommendation && formik.errors.initialRecommendation && (
                <div className="error">{formik.errors.initialRecommendation}</div>
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
                defaultText={intl.formatMessage({ id: "LABEL.SELECT.TYPE" })}
                value={formik.values.type}
                data={typeOptions}
                setSelectedValue={(value) => formik.setFieldValue('type', value)}
              />
              {formik.touched.type && formik.errors.type && (
                <div className="error">{formik.errors.type}</div>
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
                  id: "LABEL.ORIGINATING.MAIN.UNIT",
                })}
                {...formik.getFieldProps('originatingMainUnit')}
                dir="rtl"
                 
              />
              {formik.touched.originatingMainUnit && formik.errors.originatingMainUnit && (
                <div className="error">{formik.errors.originatingMainUnit}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.ORIGINATING.SUBUNIT" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                autoComplete='off'
                className={`form-control ${formik.touched.originatingSubunit && formik.errors.originatingSubunit ? 'is-invalid' : ''}`}
                {...formik.getFieldProps('originatingSubunit')}
                dir="rtl"
              />
              {formik.touched.originatingSubunit && formik.errors.originatingSubunit && (
                <div className="invalid-feedback">{formik.errors.originatingSubunit}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.CURRENT.ASSIGNMENT" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                autoComplete='off'
                className={`form-control ${formik.touched.currentAssignment && formik.errors.currentAssignment ? 'is-invalid' : ''}`}
                {...formik.getFieldProps('currentAssignment')}
                dir="rtl"
              />
              {formik.touched.currentAssignment && formik.errors.currentAssignment && (
                <div className="invalid-feedback">{formik.errors.currentAssignment}</div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button
              type="submit"
              className="btn MOD_btn btn-create w-10 pl-5 mx-3"
              disabled={isLoading || !formik.isValid}
            >
              <BtnLabeltxtMedium2 
                text={isLoading ? "BUTTON.LABEL.SAVING" : 
                  mode === 'add' ? "BUTTON.LABEL.SUBMIT" : "BUTTON.LABEL.UPDATE"} 
              />
            </button>
            <button
              type="button"
              className="btn btn-secondary mx-3"
              onClick={() => formik.resetForm()}
            >
              <BtnLabelCanceltxtMedium2 text={"BUTTON.LABEL.CANCEL"} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ArticleForm;
