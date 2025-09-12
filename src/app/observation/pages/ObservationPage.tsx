import React from 'react';
import { ObservationSteppers } from '../components/ObervationSteppers';
import './ObservationPage.css';
import ActionsDisplay from '../components/ActionsDisplay';

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
    <div className="container-fluid observation-page-container">
      <div className="card observation-page-card">
        <div className="card-body observation-page-card-body">
          {/* <ActionsDisplay 
                          recommendationId={9}
                        /> */}
          <ObservationSteppers />
        </div>
      </div>
    </div>
  );
};

export default ObservationPage;
