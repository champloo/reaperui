{
  pkgs,
  inputs,
  ...
}:
{
  packages = with pkgs; [
    git
    just
  ];

  languages.javascript = {
    enable = true;
    pnpm.enable = true;
  };
  languages.typescript.enable = true;
}
