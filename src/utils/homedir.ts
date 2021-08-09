export function homedir(): string {
  const home = Deno.env.get('HOME') ?? Deno.env.get('USERPROFILE')

  return home!
}
