# Want to update dependencies? Go to https://github.com/NixOS/nixpkgs/tree/nixpkgs-unstable and
# replace the commit ref in the following line with the one you're interested in (probably the
# latest).
{ nixpkgs ? import (fetchTarball https://github.com/NixOS/nixpkgs/archive/refs/tags/24.11.tar.gz) { config = { allowUnfree = true; }; } }:

let
  k3d = nixpkgs.stdenv.mkDerivation rec {
    version = "5.8.3";  # Updated version
    pname = "k3d";

    src = builtins.fetchurl {
      url = "https://github.com/rancher/k3d/releases/download/v5.8.3/k3d-linux-amd64";  # Updated URL
      sha256 = "dbaa79a76ace7f4ca230a1ff41dc7d8a5036a8ad0309e9c54f9bf3836dbe853e";  # Replace with the correct SHA256
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
    version = "2.15.0";  # Updated version
    pname = "skaffold";
    src = builtins.fetchurl {
      url = "https://github.com/GoogleContainerTools/skaffold/releases/download/v2.15.0/skaffold-linux-amd64";  # Updated URL
      sha256 = "089d45bca89437ef47739cf01f1d50c50855ccb483bf18b43a8303d12005c8c5";  # Replace with the correct SHA256
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
  nixpkgs.nodejs_22
  nixpkgs.minikube
  k3d
  skaffold
]
