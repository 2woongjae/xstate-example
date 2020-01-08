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
      await sleep(Math.random() * 1000);
      const res = await axios.get<GithubUser[]>(
        Math.random() > 0.7
          ? "https://api.github.com/users"
          : "http://localhost:5000/users"
      );
      console.log("YES");
      setUsers(res.data);
    } catch (error) {
      console.log("NO");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <button onClick={request}>Request</button>
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>{error.message}</p>}
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

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export default App;
