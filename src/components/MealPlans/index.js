import React from 'react';

import { withAuthorization } from '../Session';

const MealPlansPage = () => (
  <div>
    <h1>meal Routine</h1>
    <p>meal</p>
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MealPlansPage);
