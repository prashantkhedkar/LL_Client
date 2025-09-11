import React, { useEffect, useRef } from 'react';
import ObservationForm, { ObservationFormData } from '../components/ObservationForm';
import '../components/observation-form.css'; 
import useObservation from '../hooks/useObservation';
import { ArticleCreateUpdateModel } from '../models/observationModel';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { useAppDispatch } from '../../../store';
import { BtnLabeltxtMedium2, BtnLabelCanceltxtMedium2 } from '../../modules/components/common/formsLabels/detailLabels';
import { useAuth } from '../../modules/auth';
import Recommendation from '../../modules/common/components/Recommendation';
import RecommendationDetails from '../../modules/common/components/RecommendationDetails';
 import { ObservationSteppers } from '../components/ObervationSteppers';

const ObservationPage: React.FC = () => {
  const intl = useIntl();
    const { auth } = useAuth();
  const dispatch = useAppDispatch();
  const formikRef = useRef<any>(null);
  const [articleState, articleActions] = useObservation();

  const handleSubmit = async (values: ObservationFormData) => {
    try {
      // Convert ObservationFormData to ArticleCreateUpdateModel
      const data: ArticleCreateUpdateModel = {
        observationSubject: values.observationSubject,
        observationTitle: values.observationTitle,
        discussion: values.discussion,
        conclusion: values.conclusion,
        initialRecommendation: values.initialRecommendation,
        type: values.type,
        originatingMainUnit: values.originatingMainUnit,  
        status: values.status || 'Draft',
      };

      const result = await articleActions.createArticle(data);

      if (result) {
        toast.success('تم إنشاء المقال بنجاح');
        console.log('Article created successfully with ID:', result);
      } else {
        toast.error('فشل في إنشاء المقال');
        console.error('Failed to create Observation');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('حدث خطأ أثناء إنشاء المقال');
    }
  };

  const handleFormSubmit = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };

  const handleCancel = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  return (
    <div className="container-fluid">
       <ObservationSteppers></ObservationSteppers> 
      <div className="card">
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">إضافة مقال جديد</span>
          </h3>
        </div>
        <div className="card-body">
          {articleState.loading && (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          
          {articleState.error && (
            <div className="alert alert-danger" role="alert">
              {articleState.error}
            </div>
          )}

          {/* <Recommendation observationId={1} /> */}
          {/* <RecommendationDetails text={'asdasdasd'} /> */}
          <ObservationForm
            onSubmit={handleSubmit}
            mode="add"
            formikRef={formikRef}
          />

          {/* Button Section */}
          <div className="row" style={{ borderTop: '1px solid #e9ecef', paddingTop: '20px', marginTop: '20px' }}>
            <div className="col-12 d-flex justify-content-end">
              <button
                type="button"
                className="btn MOD_btn btn-create w-10 pl-5 mx-3"
                onClick={handleFormSubmit}
                disabled={articleState.loading || (formikRef.current && !formikRef.current.isValid)}
              >
                <BtnLabeltxtMedium2 
                  text={articleState.loading ? "BUTTON.LABEL.SAVING" : "BUTTON.LABEL.SUBMIT"} 
                />
              </button>
              <button
                type="button"
                className="btn btn-secondary mx-3"
                onClick={handleCancel}
              >
                <BtnLabelCanceltxtMedium2 text={"BUTTON.LABEL.CANCEL"} />
              </button>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default ObservationPage;
