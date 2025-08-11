import React, { useContext, useState } from 'react';
import { GitHubContext } from '../context/GitHubContext';

export default function Main() {
  const { userData, repos, loading, error, fetchGitHubData } = useContext(GitHubContext);
  const [username, setUsername] = useState('');
  const [filterText, setFilterText] = useState('');
  const [sortOption, setSortOption] = useState('name');

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGitHubData(username);
  };

  const filteredAndSortedRepos = repos
    .filter(repo => repo.name.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) =>
      sortOption === 'name'
        ? a.name.localeCompare(b.name)
        : b.stargazers_count - a.stargazers_count
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white p-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Mini GitHub Explorer</h1>
          <form onSubmit={handleSearch} className="flex space-x-2 w-full sm:w-auto">
            <input
              type="text"
              className="flex-grow px-4 py-2 rounded-l-md text-gray-700 focus:outline-none"
              placeholder="GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-r-md font-semibold"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        {userData && (
          <div className="flex flex-col sm:flex-row items-center bg-white shadow-md rounded-lg p-6 mb-6 gap-6">
            <img
              src={userData.avatar_url}
              alt="avatar"
              className="w-24 h-24 rounded-full border-2 border-indigo-600"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800">
                {userData.name || userData.login}
              </h2>
              <p className="text-gray-600 mt-1">{userData.bio}</p>
              <div className="flex flex-wrap items-center mt-4 text-gray-700">
                <span className="mr-4">
                  Public Repos :- <strong>{userData.public_repos}</strong>
                </span>
                <a
                  href={userData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded hover:bg-indigo-200"
                >
                  View Profile
                </a>
              </div>
            </div>
          </div>
        )}

        {repos.length > 0 && (
          <>
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
              <input
                type="text"
                placeholder="Filter repos..."
                className="px-4 py-2 rounded border border-gray-300 focus:outline-none"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 rounded border border-gray-300 focus:outline-none"
              >
                <option value="name">Sort by Name</option>
                <option value="stars">Sort by Stars</option>
              </select>
            </div>
             <div >
              <h2 className="text-3xl font-semibold py-4">Repositories :-</h2>
             </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {filteredAndSortedRepos.map(repo => (
                <div key={repo.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-indigo-800 hover:underline">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="break-words">
                      {repo.name}
                    </a>
                  </h3>
                  {repo.description && <p className="text-gray-600 mt-1">{repo.description}</p>}
                  <div className="mt-3 text-gray-700 flex items-center">
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                      ⭐ {repo.stargazers_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
