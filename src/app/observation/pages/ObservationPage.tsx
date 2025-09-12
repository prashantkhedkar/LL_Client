import React from 'react';
import { ObservationSteppers } from '../components/ObervationSteppers';
import './ObservationPage.css';
import ActionsDisplay from '../components/ActionsDisplay';

const ObservationPage: React.FC = () => {
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
