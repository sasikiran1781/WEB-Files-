import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [latestAnalysis, setLatestAnalysis] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [medications, setMedications] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load user from storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('reva_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsInitialized(true);
    }, []);

    const login = (userData = {}, token) => {
        // Normalize name field — backend may send full_name or name
        const normalized = {
            ...userData,
            name: userData?.name || userData?.full_name || '',
            full_name: userData?.full_name || userData?.name || '',
        };
        setUser(normalized);
        localStorage.setItem('reva_user', JSON.stringify(normalized));
        localStorage.setItem('reva_token', token || 'reva-demo-token');
    };

    const logout = () => {
        setUser(null);
        setLatestAnalysis(null);
        setPatientHistory([]);
        setChatMessages([]);
        setMedications([]);
        localStorage.removeItem('reva_user');
        localStorage.removeItem('reva_token');
    };

    const updateAnalysis = (analysis) => {
        setLatestAnalysis(analysis);
        // Extract medications if present in analysis
        if (analysis?.medications) {
            setMedications(analysis.medications);
        }
    };

    const value = {
        user,
        setUser,
        isInitialized,
        login,
        logout,
        latestAnalysis,
        setLatestAnalysis: updateAnalysis,
        patientHistory,
        setPatientHistory,
        selectedReport,
        setSelectedReport,
        chatMessages,
        setChatMessages,
        medications,
        setMedications,
        loading,
        setLoading,
        error,
        setError,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
