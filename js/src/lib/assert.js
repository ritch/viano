export default function assert(ok, msg) {
  if (!ok) throw new Error(msg)
}