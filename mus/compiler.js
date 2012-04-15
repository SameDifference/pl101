var t = 0;

function pitch2midi(pitch) {
	return 12 + 12 * (pitch.charCodeAt(1) - 48) + (pitch.charCodeAt(0) - 97);
}

function translate(musexpr, notes) {
    var note = {};
    var left, right, lt, rt;
    switch (musexpr.tag) {
		case 'rest':
		case 'note':
			note.tag = 'note';
			if (musexpr.pitch === undefined) {
				note.pitch = 0;
			} else {
				note.pitch = pitch2midi(musexpr.pitch);
			}
			note.start = t;
			note.dur = musexpr.dur;	
			notes.push(note);
			return;
		case 'seq':
			left = translate(musexpr.left, notes);
			if (musexpr.left.dur === undefined) musexpr.left.dur = 0;
			t += musexpr.left.dur;
			right = translate(musexpr.right, notes);
			if (musexpr.right.dur === undefined) musexpr.right.dur = 0;
			t += musexpr.right.dur;
			break;
		case 'par':
			left = translate(musexpr.left, notes);
			if (musexpr.left.dur === undefined) musexpr.left.dur = 0;
			lt = musexpr.left.dur;
			right = translate(musexpr.right, notes);
			if (musexpr.right.dur === undefined) musexpr.right.dur = 0;
			rt = musexpr.right.dur;
			t += ((lt > rt) ? lt : rt);
			break;
	}
	notes.push(left);
	notes.push(right);
}

function removenull(musexpr) {
	var dexpr = [];
	for (expr in musexpr) {
		if (musexpr[expr] !== undefined && musexpr[expr] !== null) {
			dexpr.push(musexpr[expr]);
		}
	}
	return dexpr;
}

function compile(musexpr) {
	var NOTE_CODE = [ ];
	t = 0;
	translate(musexpr, NOTE_CODE);
	NOTE_CODE = removenull(NOTE_CODE);
	return NOTE_CODE;
}

var melody_mus = 
    { tag: 'seq',
      left: 
      { tag: 'seq',
         left: { tag: 'rest', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } 
      },
      right:
      { tag: 'seq',
         left: { tag: 'seq',
			left: {tag: 'note', pitch: 'd7', dur: 250 },
			right: { tag: 'seq', 
				left: { tag: 'note', pitch: 'b4', dur: 250 },
				right:{ tag: 'note', pitch: 'e1', dur: 250 }
			}
		 },
         right: { tag: 'seq',
			left: { tag: 'note', pitch: 'b4', dur: 250 },
			right: {tag: 'rest', pitch: 'd7', dur: 500 }
		 }
	  }
	  };

/* rhino || ie: let console.log be used instead of print */
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function(g) {print(g);} };
if (typeof print == "undefined") var console = { log: function(h) {} };

console.log(JSON.stringify(melody_mus));
console.log(JSON.stringify((compile(melody_mus))));
