{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
    devenv = {
      url = "github:cachix/devenv";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nixpkgs-python = {
      url = "github:cachix/nixpkgs-python";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = {
    self,
    nixpkgs,
    devenv,
    systems,
    ...
  } @ inputs: let
    forEachSystem = nixpkgs.lib.genAttrs (import systems);
  in {
    packages = forEachSystem (system: {
      devenv-up = self.devShells.${system}.default.config.procfileScript;
    });

    devShells =
      forEachSystem
      (
        system: let
          pkgs = nixpkgs.legacyPackages.${system};
        in {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
              {
                # https://devenv.sh/reference/options/
                packages = [
                  (
                    pkgs.python3.withPackages (
                      python-pkgs: [
                        python-pkgs.emoji
                        python-pkgs.httpx
                        python-pkgs.msgspec
                        python-pkgs.mypy
                        python-pkgs.pygithub
                        python-pkgs.whenever
                      ]
                    )
                  )
                  pkgs.dart-sass
                  pkgs.just
                  pkgs.nodePackages.prettier
                  pkgs.pandoc
                  pkgs.pre-commit
                  pkgs.ruff
                  pkgs.taplo
                ];
                enterShell = "pre-commit install";
              }
            ];
          };
        }
      );
  };
}
