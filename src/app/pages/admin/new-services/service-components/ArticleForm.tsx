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
  title: string;
  subject: string;
  level: string;
  type: string;
  institution: string;
  faculty: string; 
  recommendations: string;
  attachments?: File[];
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, initialValues, mode = 'add' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  const lang = useLang();


  const validationSchema = Yup.object({
    title: Yup.string().required('العنوان مطلوب'),
    subject: Yup.string().required('الموضوع مطلوب'),
    level: Yup.string().required('المستوى مطلوب'),
    type: Yup.string().required('النوع مطلوب'),
    institution: Yup.string().required('المؤسسة مطلوبة'),
    faculty: Yup.string().required('الكلية مطلوبة'),
    
    recommendations: Yup.string().required('التواصي مطلوبة'),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      subject: '',
      level: '',
      type: '',
      institution: '',
      faculty: '', 
      recommendations: '',
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

  const levelOptions = [
    { lookupId: 'beginner', lookupNameAr: 'مبتدئ', lookupName: 'Beginner' },
    { lookupId: 'intermediate', lookupNameAr: 'متوسط', lookupName: 'Intermediate' },
    { lookupId: 'advanced', lookupNameAr: 'متقدم', lookupName: 'Advanced' },
  ];

  const typeOptions = [
    { lookupId: 'article', lookupNameAr: 'مقال', lookupName: 'Article' },
    { lookupId: 'research', lookupNameAr: 'بحث', lookupName: 'Research' },
    { lookupId: 'study', lookupNameAr: 'دراسة', lookupName: 'Study' },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="article-form rtl-form">
      <PageHeader 
        title={mode === 'add' ? intl.formatMessage({ id: "LABEL.NEW.ARTICLE" }) : intl.formatMessage({ id: "LABEL.EDIT.ARTICLE" })}
        subject={formik.values.title || intl.formatMessage({ id: "LABEL.ARTICLE.SUBTITLE" })}
        type={formik.values.type ? typeOptions.find(opt => opt.lookupId === formik.values.type)?.lookupNameAr : undefined}
        level={formik.values.level ? levelOptions.find(opt => opt.lookupId === formik.values.level)?.lookupNameAr : undefined}
      />
      <div className="row">
        <div className="col-12 mb-4">
          <div className="form-group row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.TITLE" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-10">
              <input
                type="text"
                 className="form-control form-control-solid active input5 lbl-txt-medium-2"
                          placeholder={intl.formatMessage({
                            id: "LABEL.TITLE",
                          })}
                {...formik.getFieldProps('title')}
                dir="rtl"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="error">{formik.errors.title}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="form-group row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.SUBJECT" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-10">
              <input
                type="text"
                className={`form-control ${formik.touched.subject && formik.errors.subject ? 'is-invalid' : ''}`}
                {...formik.getFieldProps('subject')}
                dir="rtl"
              />
              {formik.touched.subject && formik.errors.subject && (
                <div className="invalid-feedback">{formik.errors.subject}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="form-group row align-items-center">
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
                defaultText={intl.formatMessage({ id: "LABEL.SELECT.LEVEL" })}
                value={formik.values.level}
                data={levelOptions}
                setSelectedValue={(value) => formik.setFieldValue('level', value)}
              />
              {formik.touched.level && formik.errors.level && (
                <div className="error">{formik.errors.level}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="form-group row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.TYPE" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-4">
              {formik.values.type} ddd
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
          <div className="form-group">
            <ContentSection
              title="التواصي"
              content={"إن المؤسسة العسكرية التي ساهم في بنائها صاحب السمو الشيخ محمد بن زايد آل نهيان رئيس الدولة القائد الأعلى للقوات المسلحة حفظه الله ويسانده أخيه صاحب السمو الشيخ محمد بن راشد آل مكتوم نائب رئيس الدولة رئيس مجلس الوزراء حاكم دبي رعاه الله هي فخر للوطن"}
            />
         
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="form-group row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.INSTITUTION" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-solid active input5 lbl-txt-medium-2"
                          placeholder={intl.formatMessage({
                            id: "LABEL.INSTITUTION",
                          })}
                {...formik.getFieldProps('institution')}
                dir="rtl"
              />
              {formik.touched.institution && formik.errors.institution && (
                <div className="error">{formik.errors.institution}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="form-group row align-items-center">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.FACULTY" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className={`form-control ${formik.touched.faculty && formik.errors.faculty ? 'is-invalid' : ''}`}
                {...formik.getFieldProps('faculty')}
                dir="rtl"
              />
              {formik.touched.faculty && formik.errors.faculty && (
                <div className="invalid-feedback">{formik.errors.faculty}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 mb-4">
          <div className="form-group row">
            <div className="col-md-2">
              <InfoLabels
                style={{}}
                text={intl.formatMessage({ id: "LABEL.RECOMMENDATIONS" })}
                isRequired={true}
              />
            </div>
            <div className="col-md-10">
              <textarea
                className="form-control"
                {...formik.getFieldProps('recommendations')}
                rows={4}
                dir="rtl"
              />
              {formik.touched.recommendations && formik.errors.recommendations && (
                <div className="error">{formik.errors.recommendations}</div>
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
