start =
    atomlist

atomlist =
    all:listoratom*
    {
     while (all.length == 1) all = all[0];
     return all; }

listoratom =
    "\n"* " "* "(" all:listoratom* ")" " "*
        { return [].concat(all); }
  / " " atm:atom
        { return atm; }
  / atm:atom
        { return atm; }
    
validchar
    =
    [0-9a-zA-Z_?!+-=@#$%^&*/.]

atom =
    chars:validchar+
        { return chars.join(""); }
