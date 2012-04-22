start =
	scheem

scheem =
	Whitespace? element:(QUOTE / ATOM / LIST) Whitespace?
		{ return element; }

LIST =
	"(" elements:scheem* ")"
		{ return elements; }

ATOM =
	atomchars:validchar+
		{ return atomchars.join(''); }

QUOTE =
	"'" quoted:scheem
		{ return ['quote', quoted]; }

COMMENT =
	";;" (!([\u000a\u000b\u000c\u000d\u0085\u2028\u2029])
	[\u0000-\uffff])*

/* un-elements */

Whitespace =
	([\u0009\u0020\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006]
  / [\u000a\u000b\u000c\u000d\u0085\u2028\u2029]
  / COMMENT)+

validchar =
	[0-9a-zA-Z_?!+=@#$%^&*/.-]
