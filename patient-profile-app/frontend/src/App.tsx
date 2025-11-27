import React from 'react';
import { Container } from 'react-bootstrap';
import { PatientProfileApp } from './components/PatientProfileApp';

function App() {
  return (
    <div className="App">
      <Container fluid>
        <PatientProfileApp />
      </Container>
    </div>
  );
}

export default App;