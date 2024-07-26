{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs =
    inputs@{
      self,
      nixpkgs,
      flake-parts,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];
      perSystem =
        { pkgs, ... }:
        {
          devShells.default = pkgs.mkShell {
            name = "website";
            packages = [
              (pkgs.python3.withPackages (python-pkgs: [
                python-pkgs.emoji
                python-pkgs.httpx
                python-pkgs.msgspec
                python-pkgs.mypy
                python-pkgs.pygithub
                python-pkgs.whenever
              ]))
              pkgs.dart-sass
              pkgs.just
              pkgs.nodePackages.prettier
              pkgs.pandoc
              pkgs.pre-commit
              pkgs.ruff
              pkgs.taplo
              pkgs.nixfmt-rfc-style
            ];
            shellHook = "pre-commit install --overwrite";
          };
          formatter = pkgs.nixfmt-rfc-style;
        };
    };
}
