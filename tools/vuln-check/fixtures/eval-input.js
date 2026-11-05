// Vulnerable on purpose: runs the ?q= query parameter as code.
export function run() {
  return eval(new URLSearchParams(location.search).get('q'))
}
