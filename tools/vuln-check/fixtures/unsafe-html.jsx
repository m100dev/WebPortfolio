// Vulnerable on purpose: renders caller-supplied HTML without sanitizing it.
export default function Bio(props) {
  return <div dangerouslySetInnerHTML={{ __html: props.bio }} />
}
