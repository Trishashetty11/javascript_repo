import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { getFromStorage, setToStorage } from './utils/localStorage';

// Setup demo data if not already present
const setupDemoData = () => {
  const existingUsers = getFromStorage('registeredUsers', []);
  
  if (existingUsers.length === 0) {
    const demoUsers = [
      {
        id: "demo-issuer-1",
        name: "Demo Institute",
        email: "issuer@demo.com",
        password: "demo123",
        role: "issuer"
      },
      {
        id: "demo-holder-1", 
        name: "John Doe",
        email: "holder@demo.com",
        password: "demo123",
        role: "holder"
      },
      {
        id: "demo-verifier-1",
        name: "Verification Corp",
        email: "verifier@demo.com", 
        password: "demo123",
        role: "verifier"
      }
    ];

    const demoCertificates = [
      {
        id: "CERT-DEMO1",
        holderName: "John Doe",
        holderEmail: "holder@demo.com",
        title: "Certificate of Completion",
        course: "Full Stack Web Development",
        issueDate: "2024-01-15",
        issuerName: "Demo Institute",
      },
      {
        id: "CERT-DEMO2", 
        holderName: "Jane Smith",
        holderEmail: "jane@example.com",
        title: "Professional Certificate",
        course: "Data Science Fundamentals", 
        issueDate: "2024-02-20",
        issuerName: "Demo Institute",
      }
    ];

    setToStorage('registeredUsers', demoUsers);
    setToStorage('issuedCertificates', demoCertificates);
    setToStorage('verificationHistory', []);
  }
};

// Initialize demo data
setupDemoData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);