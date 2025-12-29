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
                # keep-sorted start
                python-pkgs.emoji
                python-pkgs.httpx
                python-pkgs.msgspec
                python-pkgs.pygithub
                python-pkgs.whenever
                # keep-sorted end
              ]))
              # keep-sorted start
              pkgs.grass-sass
              pkgs.just
              pkgs.netlify-cli
              pkgs.pandoc
              # keep-sorted end
            ]
            # Pre-commit
            ++ [
              # keep-sorted start
              pkgs.basedpyright
              pkgs.deadnix
              pkgs.json-sort-cli
              pkgs.keep-sorted
              pkgs.markdownlint-cli2
              pkgs.nixfmt
              pkgs.nodePackages.prettier
              pkgs.pre-commit
              pkgs.python3Packages.pre-commit-hooks
              pkgs.ratchet
              pkgs.ruff
              pkgs.toml-sort
              pkgs.typos
              pkgs.yamlfix
              pkgs.zizmor
              # keep-sorted end
            ];
            shellHook = "pre-commit install --overwrite";
          };
          formatter = pkgs.nixfmt-tree;
        };
    };
}
