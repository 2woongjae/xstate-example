import React from "react";
import axios from "axios";
import requestUsers, { GithubUser } from "./machines/requestUsers";
import { useMachine } from "@xstate/react";

const App: React.FC = () => {
  const [requestUsersState, sendToRequestUsersMachine] = useMachine(
    requestUsers,
    {
      actions: {
        request: async (context, event) => {
          try {
            await sleep(Math.random() * 1000);
            const res = await axios.get<GithubUser[]>(
              Math.random() > 0.7
                ? "https://api.github.com/users"
                : "http://localhost:5000/users"
            );
            console.log("YES");
            sendToRequestUsersMachine({ type: "RESOLVE", users: res.data });
          } catch (error) {
            console.log("NO");
            sendToRequestUsersMachine({ type: "REJECT", error });
          }
        }
      }
    }
  );

  return (
    <div>
      <button onClick={() => sendToRequestUsersMachine({ type: "REQUEST" })}>
        Request
      </button>
      {requestUsersState.matches("pending") && <p>Loading...</p>}
      {requestUsersState.matches("fail") && (
        <p>{requestUsersState.context.error.message}</p>
      )}
      {requestUsersState.matches("success") && (
        <div>
          {requestUsersState.context.users.map(user => (
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
