import { Children } from 'react';

export default function Truncate({ children }) {

  const length = Children.count(children);
  const result = Children.toArray(children);

  const limit = Math.floor((700 - 70) / ((2.75 * 2) + 120));

  const max = Math.min(length, limit);

  console.log(limit, max);

  const output = result.slice(0, max);

  if (max < length) {
    output.push(
      <p style={{fontSize: 20, margin: "1px", color: "white"}}>...</p>
    )
  };

  return output;
}