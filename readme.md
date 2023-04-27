# X

Some useful command for myself.

## Install

```sh
deno install -r -Af --import-map https://raw.githubusercontent.com/0x-jerry/x/main/import_map.json https://raw.githubusercontent.com/0x-jerry/x/main/x.ts
deno install -r -Af --import-map https://raw.githubusercontent.com/0x-jerry/x/main/import_map.json https://raw.githubusercontent.com/0x-jerry/x/main/xr.ts
deno install -r -Af --import-map https://raw.githubusercontent.com/0x-jerry/x/main/import_map.json https://raw.githubusercontent.com/0x-jerry/x/main/xn.ts
```

## Command Completions

Add this code to `~/.zshrc`

```zsh
source <(x completions zsh)
source <(xr completions zsh)
source <(xn completions zsh)
```
