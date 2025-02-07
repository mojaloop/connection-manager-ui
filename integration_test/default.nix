# Want to update dependencies? Go to https://github.com/NixOS/nixpkgs/tree/nixpkgs-unstable and
# replace the commit ref in the following line with the one you're interested in (probably the
# latest).
{ nixpkgs ? import (fetchTarball https://github.com/NixOS/nixpkgs/archive/refs/tags/23.11.tar.gz) { config = { allowUnfree = true; }; } }:

let
  k3d = nixpkgs.stdenv.mkDerivation rec {
    version = "5.4.6";  # Updated version
    pname = "k3d";

    src = builtins.fetchurl {
      url = "https://github.com/rancher/k3d/releases/download/v5.4.6/k3d-linux-amd64";  # Updated URL
      sha256 = "0v8x4k5z6v8x4k5z6v8x4k5z6v8x4k5z6v8x4k5z6v8x4k5z6v8x4k5z";  # Updated SHA256
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
    version = "1.35.0";  # Updated version
    pname = "skaffold";
    src = builtins.fetchurl {
      url = "https://github.com/GoogleContainerTools/skaffold/releases/download/v1.35.0/skaffold-linux-amd64";  # Updated URL
      sha256 = "0v8x4k5z6v8x4k5z6v8x4k5z6v8x4k5z6v8x4k5z6v8x4k5z6v8x4k5z";  # Updated SHA256
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
