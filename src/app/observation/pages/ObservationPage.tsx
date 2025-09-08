import React, { useEffect } from 'react';
import ObservationForm, { ObservationFormData } from '../components/ObservationForm';
import '../components/observation-form.css';
import TextMessageDisplay from '../../modules/common/components/TextMessageDisplay';
import useObservation from '../hooks/useObservation';
import { ArticleCreateUpdateModel } from '../models/observationModel';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { useAppDispatch } from '../../../store';

const ObservationPage: React.FC = () => {
  const intl = useIntl();
    const dispatch = useAppDispatch();
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
        originatingSubunit: values.originatingSubunit,
        currentAssignment: values.currentAssignment,
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

  return (
    <div className="container-fluid">
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

          {/* <TextMessageDisplay 
            text="Your message text here"
            timestamp={new Date()} 
            status="read"
            direction="rtl"
          /> */}
          <ObservationForm
            onSubmit={handleSubmit}
            mode="add"  
          />
         
        </div>
      </div>
    </div>
  );
};

export default ObservationPage;
