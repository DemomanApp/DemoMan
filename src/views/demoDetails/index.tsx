import { useAsync } from "react-async-hook";
import { Link, useParams } from "react-router-dom";
import { getDemoByName } from "../../api";

export default function DemoDetailsView() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const demoName = decodeURIComponent(useParams().demoName!);
  const asyncDemo = useAsync(getDemoByName, [demoName]);

  if (asyncDemo.loading) {
    return <h1>Loading...</h1>;
  }
  if (asyncDemo.error !== undefined) {
    return <h1>Error!</h1>;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const demo = asyncDemo.result!;

  return (
    <div>
      <h1>{demo.name}</h1>
      <Link to="/">Back</Link>
    </div>
  );
}
