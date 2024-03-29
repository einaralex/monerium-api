import type { NextPage, GetServerSideProps } from "next";
import CryptoJS from "crypto-js";
import Cookies from "cookies";
import { useRouter } from "next/router";
import { AuthContext, AuthProfile } from "../types";

const Home: NextPage<{ authContext: AuthContext }> = ({ authContext }) => {
  const router = useRouter();

  return (
    <div>
      <h1>Welcome {authContext.email}</h1>
      <p>You have access to the following profiles</p>
      <>
        {authContext.profiles.map((u: AuthProfile, i: number) => {
          return <p key={i}>{u.name}</p>;
        })}
      </>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);

  const headers = new Headers();
  headers.append("content-type", "application/x-www-form-urlencoded"); // Required

  const authToken = await fetch("https://api.monerium.dev/auth/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: "1234567890abcdef",
      client_secret: "1234567890abcdef1234567890abcdef",
      grant_type: "client_credentials",
    }),
    headers: headers,
  });
  const clientCredentials = await authToken.json();

  const authContext = await fetch("https://api.monerium.dev/auth/context", {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${clientCredentials.access_token}`,
    }),
  });

  return {
    props: { authContext: await authContext.json() }, // will be passed to the page component as props
  };
};
export default Home;
