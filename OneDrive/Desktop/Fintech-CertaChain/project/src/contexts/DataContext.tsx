import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Certificate, VerificationRecord, DataContextType } from '../types';
import { getFromStorage, setToStorage } from '../utils/localStorage';
import { isThisMonth } from '../utils/dateHelpers';

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [verificationHistory, setVerificationHistory] = useState<VerificationRecord[]>([]);

  useEffect(() => {
    const savedCertificates = getFromStorage<Certificate[]>('issuedCertificates', []);
    const savedHistory = getFromStorage<VerificationRecord[]>('verificationHistory', []);
    setCertificates(savedCertificates);
    setVerificationHistory(savedHistory);
  }, []);

  const addCertificate = (certificate: Certificate) => {
    const updatedCertificates = [...certificates, certificate];
    setCertificates(updatedCertificates);
    setToStorage('issuedCertificates', updatedCertificates);
  };

  const addVerificationRecord = (record: VerificationRecord) => {
    const updatedHistory = [...verificationHistory, record];
    setVerificationHistory(updatedHistory);
    setToStorage('verificationHistory', updatedHistory);
  };

  const getCertificateById = (id: string): Certificate | undefined => {
    return certificates.find(cert => cert.id === id);
  };

  const getCertificatesForHolder = (holderName: string, holderEmail?: string): Certificate[] => {
    return certificates.filter(cert => 
      cert.holderName.toLowerCase() === holderName.toLowerCase() ||
      (holderEmail && cert.holderEmail?.toLowerCase() === holderEmail.toLowerCase())
    );
  };

  const getIssuerStats = (issuerName: string) => {
    const issuerCerts = certificates.filter(cert => cert.issuerName === issuerName);
    const thisMonthCerts = issuerCerts.filter(cert => isThisMonth(cert.issueDate));
    const uniqueHolders = new Set(issuerCerts.map(cert => cert.holderEmail || cert.holderName)).size;

    return {
      total: issuerCerts.length,
      thisMonth: thisMonthCerts.length,
      uniqueHolders
    };
  };

  const value: DataContextType = {
    certificates,
    verificationHistory,
    addCertificate,
    addVerificationRecord,
    getCertificateById,
    getCertificatesForHolder,
    getIssuerStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};