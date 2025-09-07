import React from 'react';
import ArticleForm, { ArticleFormData } from './service-components/ArticleForm';
import './service-components/article-form.css';
import TextMessageDisplay from '../../../modules/common/components/TextMessageDisplay';

const ArticlePage: React.FC = () => {
  const handleSubmit = async (values: ArticleFormData) => {
    try {
      // TODO: Implement your API call here
      console.log('Form submitted:', values);
    } catch (error) {
      console.error('Error submitting form:', error);
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
           <TextMessageDisplay 
            text="Your message text here"
            timestamp={new Date()} 
            status="read"
            direction="rtl"
          />
          <ArticleForm onSubmit={handleSubmit} mode="add" />
         
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
