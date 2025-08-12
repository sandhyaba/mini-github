import React, { createContext, useState } from 'react';
import axios from 'axios';

export const GitHubContext = createContext();

export const GitHubProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGitHubData = async (username) => {
  if (!username.trim()) return;

  setLoading(true);
  setError('');
  setUserData(null);
  setRepos([]);

  try {
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos`);

    setUserData(userRes.data);

    if (reposRes.data.length === 0) {
      setError('This user has no public repositories.');
    } else {
      setRepos(reposRes.data);
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      setError('🚫 GitHub user not found. Please check the username.');
    } else if (err.message === 'Network Error') {
      setError('⚠️ Network error. Please check your connection.');
    } else {
      setError(`❌ ${err.message}`);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <GitHubContext.Provider value={{ userData, repos, loading, error, fetchGitHubData }}>
      {children}
    </GitHubContext.Provider>
  );
};
