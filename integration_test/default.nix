# Want to update dependencies? Go to https://github.com/NixOS/nixpkgs/tree/nixpkgs-unstable and
# replace the commit ref in the following line with the one you're interested in (probably the
# latest).
{ nixpkgs ? import (fetchTarball https://github.com/NixOS/nixpkgs/archive/08ef0f28e3a41424b92ba1d203de64257a9fca6a.tar.gz) { config = { allowUnfree = true; }; } }:

let
  k3d = nixpkgs.stdenv.mkDerivation rec {
    version = "4.4.1";
    pname = "k3d";

    src = builtins.fetchurl {
      url = "https://github.com/rancher/k3d/releases/download/v4.4.1/k3d-linux-amd64";
      sha256 = "1bjmyhf0zbi6lfq71h6vazmlkxg0b46wky5vqv1dqbkr2bdr2s24";
    };

    dontUnpack = true;

    installPhase = ''
      mkdir -p $out/bin
      cp $src $out/bin/k3d
      chmod +x $out/bin/k3d
    '';

    dontFixup = true;
  };

  skaffold = nixpkgs.stdenv.mkDerivation rec {
    version = "1.28.0";
    pname = "skaffold";
    src = builtins.fetchurl {
      url = "https://github.com/GoogleContainerTools/skaffold/releases/download/v1.28.0/skaffold-linux-amd64";
      sha256 = "1aiggw0b8655mzzf57xv079vzgfj4k3xwlr7l48y2pvbzy46f0mg";
    };
    dontUnpack = true;
    installPhase = ''
      mkdir -p $out/bin
      cp $src $out/bin/skaffold
      chmod +x $out/bin/skaffold
      '';
  };

in

[
  nixpkgs.google-chrome
  nixpkgs.kubeconform
  nixpkgs.kustomize
  nixpkgs.kubectl
  nixpkgs.nodejs-16_x
  nixpkgs.minikube
  k3d
  skaffold
]
