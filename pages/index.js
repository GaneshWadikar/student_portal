import axios from "axios";

export default function Home() {
  return <></>;
}

export async function getServerSideProps(context) {
  let token = context.req.cookies.token;
  if (!token) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  }
  try {
    let { data } = await axios.get(
      `http://${context.req.headers.host}/api/whoiam`,
      { headers: { Authorization: token } }
    );

    if (data.status === 400) {
      return redirect(data.message);
    }

    if (data.iam === "teacher")
      return {
        redirect: {
          destination: `/teacher`,
          permanent: false,
        },
      };
    else
      return {
        redirect: {
          destination: `/student`,
          permanent: false,
        },
      };
  } catch (e) {
    return {
      redirect: {
        destination: `/login?reason=Invalid or Expired Authorization Token`,
        permanent: false,
      },
    };
  }
}
