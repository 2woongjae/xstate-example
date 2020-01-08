import React, { useState } from "react";
import "./App.css";
import axios from "axios";

interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  async function request() {
    try {
      setUsers([]);
      setError(null);
      setIsLoading(true);
      const res = await axios.get<GithubUser[]>("https://api.github.com/users");
      setUsers(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <button onClick={request}>Request</button>
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>{error}</p>}
      {!isLoading && error === null && (
        <div>
          {users.map(user => (
            <div key={user.id}>
              <img
                src={user.avatar_url}
                alt={user.login}
                style={{ width: 50 }}
              />
              <span>{user.login}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
