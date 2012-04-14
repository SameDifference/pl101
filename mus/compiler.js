var t = 0;

function endTime(time, expr) {
    var curTime = time;
    var json = JSON.parse(JSON.stringify(expr));
    if (json.tag == 'note' || json.tag == 'rest') {
        curTime += json.dur;
    } else if (json.tag == 'seq') {
        curTime += endTime(0, json.right) + endTime(0, json.left);
    } else if (json.tag == 'par') {
        curTime += (endTime(0, json.right) > endTime(0, json.left) ? endTime(0, json.right) : endTime(0, json.left));
    }
    return curTime;
}

function pitch2midi(pitch) {
	return 12 + 12 * (pitch.charCodeAt(1) - 48) + (pitch.charCodeAt(0) - 99);
}

function translate(musexpr) {
    var note = {};
    var left, right, lt, rt;
    if (musexpr.tag == 'note') {
        note.tag = 'note';
        note.pitch = pitch2midi(musexpr.pitch);
        note.start = t;
        note.dur = musexpr.dur;
        return JSON.stringify(note);
    } else if (musexpr.tag == 'seq') {
        left = translate(musexpr.left);
        if (musexpr.left.dur === undefined) musexpr.left.dur = 0;
        t += musexpr.left.dur;
        right = translate(musexpr.right);
        t += musexpr.right.dur;
        return left + ", " + right;
    } else if (musexpr.tag == 'par') {
        left = translate(musexpr.left);
        if (musexpr.left.dur === undefined) musexpr.left.dur = 0;
        lt = musexpr.left.dur;
        right = translate(musexpr.right);
        rt = musexpr.right.dur;
        if (lt > rt) {
            t += lt;
        } else {
            t += rt;
        }
        return left + ", " + right;
    } else if (musexpr.tag == 'rest') {
        note.tag = 'note';
        note.pitch = 0;
        note.start = t;
        note.dur = musexpr.dur;
        return JSON.stringify(note);
    }
}

function compile(musexpr) {
    return JSON.parse("[" + translate(musexpr) + "]");
}

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'rest', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'rest', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

/* rhino: let console.log be used instead of print */
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function(g) {print(g);} };
if (typeof print == "undefined") var console = { log: function(h) {} };

console.log(JSON.stringify(melody_mus));
console.log(JSON.stringify((compile(melody_mus))));
