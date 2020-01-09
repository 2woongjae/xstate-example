import { Machine, assign } from "xstate";

export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
}

interface RequestUsersStates {
  states: {
    idle: {};
    pending: {};
    success: {};
    fail: {};
  };
}

type RequestUsersMachineEvents =
  | { type: "REQUEST" }
  | { type: "RESOLVE"; users: GithubUser[] }
  | { type: "REJECT"; error: Error };

interface RequestUsersContext {
  users: GithubUser[];
  error: Error;
}

const requestUsers = Machine<
  RequestUsersContext,
  RequestUsersStates,
  RequestUsersMachineEvents
>(
  {
    id: "request-users",
    initial: "idle",
    context: {
      users: [],
      error: new Error()
    },
    states: {
      idle: {
        on: {
          REQUEST: "pending"
        }
      },
      pending: {
        invoke: {
          src: "request",
          onDone: { target: "success", actions: ["setUsers"] },
          onError: { target: "fail", actions: ["setError"] }
        }
      },
      success: {
        on: {
          REQUEST: "pending"
        }
      },
      fail: {
        on: {
          REQUEST: "pending"
        }
      }
    }
  },
  {
    actions: {
      setUsers: assign((context, event: any) => ({
        users: event.data
      })),
      setError: assign((context, event: any) => ({
        error: event.data
      }))
    }
  }
);

export default requestUsers;
