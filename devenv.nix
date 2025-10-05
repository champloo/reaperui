{
  pkgs,
  inputs,
  ...
}:
{
  packages = with pkgs; [
    git
    just
    chromium
  ];

  languages.javascript = {
    enable = true;
    pnpm.enable = true;
  };
  languages.typescript.enable = true;
}
