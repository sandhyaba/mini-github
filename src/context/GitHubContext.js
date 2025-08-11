import React, { createContext, useState } from 'react';

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
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (userRes.status === 404) throw new Error('User not found');
      if (!userRes.ok) throw new Error('Failed to fetch user data');
      const user = await userRes.json();

      const reposRes = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!reposRes.ok) throw new Error('Error fetching repositories');
      const reposData = await reposRes.json();

      setUserData(user);

      if (reposData.length === 0) {
        setError('This user has no public repositories.');
      } else {
        setRepos(reposData);
      }
    } catch (err) {
      if (err.message === 'User not found') {
        setError('🚫 GitHub user not found. Please check the username.');
      } else if (err.message === 'Failed to fetch') {
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
