# Want to update dependencies? Go to https://github.com/NixOS/nixpkgs/tree/nixpkgs-unstable and
# replace the commit ref in the following line with the one you're interested in (probably the
# latest).
{ nixpkgs ? import (fetchTarball https://github.com/NixOS/nixpkgs/archive/08ef0f28e3a41424b92ba1d203de64257a9fca6a.tar.gz) {} }:
nixpkgs.mkShell {
  nativeBuildInputs = import ./default.nix { inherit nixpkgs; };
}
