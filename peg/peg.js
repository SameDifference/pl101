start =
    atomlist

atomlist =
    all:element*
    {
     while (all instanceof Array && all.length == 1) all = all[0];
     return all; }

element =
    "\n"? " "* "(" all:element* ")" " "*
        { return [].concat(all); }
  / " "+ atm:atom
        { return atm; }
  / atm:atom
        { return atm; }
  / ";;" text:[^\n\r]* EOL 
        { return {tag: "comment", text: text.join("")}; }

validchar
    =
    [0-9a-zA-Z_?!+=@#$%^&*/.-]

EOL
 = [\n\r]{1,2} / !. 

atom =
    chars:validchar+
        { return chars.join(""); }
