import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome';
import SignIn from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateQuestionnaire from './pages/CandidateQuestionnaire';
import Questionaire from './pages/Questionaire';
import ViewOnlyQuestionnaire from './pages/ViewOnlyQuestionnaire';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forget" element={<ForgotPassword />} />
        <Route path="/app" element={<RecruiterDashboard />} />
        <Route path="/question" element={<Questionaire />} />
        {/* <Route path="/view-questionnaire" element={<ViewOnlyQuestionnaire />} /> */}
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/:campaignId" element={<CandidateQuestionnaire />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
