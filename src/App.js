import Navbar from './components/Main';
import { GitHubProvider } from './context/GitHubContext';

function App() {
  return (
    <GitHubProvider>
      <Navbar />
    </GitHubProvider>
  );
}

export default App;
