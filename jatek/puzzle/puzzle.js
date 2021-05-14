// Dan Zen - made in one day along with hosting a wild party at the PagodaScope in VR
// Cheers to Ami Hanya who made a similar puzzle way back in ZIM 
// https://www.emanueleferonato.com/2018/03/13/build-a-html5-jigsaw-puzzle-game-with-zim-framework/

// This version adds the following and comments:
// ES6, sequenced start, Emitter, rotating pieces, drop shadow raise, border, 
// hint and picture interface option, madeWith, restart
// and is the same amount of code - yay ZIM progress!
// The pieces class still looks complicated - actually, Generator() might work to use relative path drawing 
// but am unsure about using Generator graphics as masks, for dragging, etc.
// as generator graphics have been moved outside normal x and y due to matrix manipulation - so did not bother.
// This does mean we have to do some calculations to handle 4 sides of the puzzle slightly differently 
// But it was do it once and then switch up x, y, and a few things

// There are a fair number of advanced concepts in here to make it all work 
// Unfortunately, a Jigsaw puzzle is often the first thing people want to make - sigh. 
// I had vowed to never make one...  but whatever... at least I held out for 30 years.
// There is also the ZIM Scrambler() for a quick puzzle along the same lines 
// https://zimjs.com/cat/scrambler.html - less jig and more saw.

const frame = new Frame("fit", 1084, 818, light, darker, "menetrend.JPG", "img/");
frame.on("ready", () => {// ES6 Arrow Function - similar to function(){}
  zog("ready from ZIM Frame"); // logs in console (F12 - choose console)

  // often need below - so consider it part of the template
  let stage = frame.stage;
  let stageW = frame.width;
  let stageH = frame.height;

  // REFERENCES for ZIM at http://zimjs.com
  // see http://zimjs.com/learn.html for video and code tutorials
  // see http://zimjs.com/docs.html for documentation
  // see https://www.youtube.com/watch?v=pUjHFptXspM for INTRO to ZIM
  // see https://www.youtube.com/watch?v=v7OT0YrDWiY for INTRO to CODE

  // CODE HERE

  const mob = mobile();

  // ~~~~~~~~~~~~~~~~~~~~~
  // CLASS to make JigSaw piece with bumps out or in or no bump on any four edges
  class Piece extends Shape {
    // format is 1 for bump out, -1 for bump in and 0 for no bump
    constructor(w = 100, h = 100, format = [1, 1, 1, 1], s = black, ss = 4, f = white) {
      super(w, h);
      const p = Piece.part; // static property - defined below class
      const g = Piece.gap;
      this.s(s).ss(ss).f(f).mt(0, 0);
      if (format[0] == 0) this.lt(w, 0); // top left-right
      else {
          this.lt(w * p, 0);
          let s = format[0] == 1 ? -1 : 1; // sign                
          this.ct(w * (p - g / 2), s * w * g, w / 2, s * w * g); // curve left to middle
          this.ct(w * (p + g + g / 2), s * w * g, w * (1 - p), 0); // curve middle to right           
          this.lt(w, 0);
        }
      if (format[1] == 0) this.lt(w, h); // right top-bottom
      else {
          this.lt(w, h * p);
          let s = format[1] == 1 ? 1 : -1;
          this.ct(w + s * w * g, h * (p - g / 2), w + s * w * g, h / 2);
          this.ct(w + s * w * g, h * (p + g + g / 2), w, h * (1 - p));
          this.lt(w, h);
        }
      if (format[2] == 0) this.lt(0, h); // bottom right-left
      else {
          this.lt(w * (1 - p), h);
          let s = format[2] == 1 ? 1 : -1;
          this.ct(w * (p + g + g / 2), h + s * w * g, w / 2, h + s * w * g);
          this.ct(w * (p - g / 2), h + s * w * g, w * p, h + 0);
          this.lt(0, h);
        }
      if (format[3] == 0) this.lt(0, 0); // left bottom-top
      else {
          this.lt(0, h * (1 - p));
          let s = format[3] == 1 ? -1 : 1;
          this.ct(s * w * g, h * (p + g + g / 2), s * w * g, h / 2);
          this.ct(s * w * g, h * (p - g / 2), 0, h * p);
          this.lt(0, 0);
        }
      this.cp(); // close path
    }}

  Piece.part = .37; // part of the edge with no gap ratio
  Piece.gap = 1 - Piece.part * 2; // gap ratio of edge


  // ~~~~~~~~~~~~~~~~~~~~~
  // PUZZLE SIZE

  let numX = 6;
  let numY = 4;
  const obj = getQueryString(); // note, getQueryString returns {} now if no query string    
  if (obj.col) numX = Math.min(14, Number(obj.col)); // or we would have to start chaching things...
  if (obj.row) numY = Math.min(10, Number(obj.row));

  // ~~~~~~~~~~~~~~~~~~~~~
  // PICTURE

  const pic = asset("menetrend.jpg").clone().center().alp(.3).vis(false); // checkbox later to turn on
  const w = pic.width / numX;
  const h = pic.height / numY;

  // chop the picture into bitmaps
  // false is for an array rather than the default Tile output 
  // extra is because bumps go outside the width and height
  const extra = Math.max(w, h) * Piece.gap;
  const pics = chop(asset("menetrend.jpg"), numX, numY, false, extra);


  // ~~~~~~~~~~~~~~~~~~~~~
  // PIECES

  // makePieces gets called from Tile - for each piece
  let count = 0;
  let lastX = rand() > .5 ? 1 : -1; // 1 or -1 for out or in horizontally
  let lastYs = []; // 1 or -1 vertically - remember with array and modulus
  loop(numX, i => {lastYs.push(rand() > .5 ? 1 : -1);});
  function makePiece() {

    // prepare format for jigsaw piece [1,0,-1,0] 
    // 1 bump out, 0 no bump, -1 bump in, etc.
    let currentX = lastX * -1; // opposite of last x
    let currentY = lastYs[count % numX] * -1; // opposite of last y
    let nextX = rand() > .5 ? 1 : -1; // randomize the next 1 or -1 for out or in horizontally
    let nextY = rand() > .5 ? 1 : -1; // and vertically
    // top, right, bottom, left
    let format = [currentY, nextX, nextY, currentX];
    lastX = nextX;
    lastYs[count % numX] = nextY;

    // override edges to 0
    if (count < numX) format[0] = 0;else
    if (count >= numX * numY - numX) format[2] = 0;
    if (count % numX == 0) format[3] = 0;else
    if ((count - numX + 1) % numX == 0) format[1] = 0;

    // make a container to hold jigsaw shape and later picture part
    let piece = new Container(w, h).centerReg({ add: false });
    piece.puzzle = new Piece(w, h, format).addTo(piece);
    piece.mouseChildren = false;
    count++;
    return piece;
  }

  const pieces = new Tile({
    obj: makePiece,
    cols: numX,
    rows: numY,
    clone: false // otherwise makes clone of piece
  }).
  center().
  drag(stage).animate({
    props: { alpha: 1 },
    time: .1,
    sequence: .05 });



  // ~~~~~~~~~~~~~~~~~~~~~
  // HINT AND SNAP HIT BOX

  // tidy up alpha setting on hint around border
  const outline = new Rectangle(pic.width, pic.height, clear, mist, 4).center().ord(-1); // under pieces    
  const hint = pieces.clone(true) // exact
  .center().
  ord(-1) // under pieces     
  .cache(-5, -5, pic.width + 10, pic.height + 10) // cache by default does not include outside border 
  .alp(.2).
  vis(0); // checkbox below to show

  // make a little box to do hit test to see if in right place
  const snap = 50; // pixel distance considered correct
  loop(hint, h => {
    h.box = new Rectangle(snap, snap).centerReg(h).vis(0); // do not use alpha=0 as that will make it not hittable        
  });


  // ~~~~~~~~~~~~~~~~~~~~~
  // ADD PICTURE TO PIECES, ADD EVENTS, ROTATE AND SCRAMBLE

  const padding = 50;
  const rotate = true;
  loop(pieces, (piece, i) => {
    piece.alp(0); // sequence animation above will animate in alpha
    pics[i].addTo(piece).setMask(piece.puzzle);
    // test on mobile and see if you need to cache...
    // usually this is just cache() but the bumps are outside the piece 
    // and the cache size really does not make a difference if rest is background transparent 
    if (mob) piece.cache(-100, -100, piece.width + 200, piece.width + 200);
    if (rotate) {
      piece.rotation = shuffle([0, 90, 180, 270])[0];
      piece.tap({
        time: .5, // within .5 seconds
        call: () => {
          pieces.noMouse(); // do not let anything happen while animating until done
          piece.animate({
            props: { rotation: String(frame.shiftKey ? -90 : 90) }, // string makes relative
            time: .2,
            call: () => {
              pieces.mouse();
              test(piece);
            } });

          stage.update();
        },
        call2: () => {// if no tap
          test(piece);
        } });

    } else {
      piece.on("pressup", () => {
        test(piece);
      });
    }
    piece.on("pressdown", () => {
      // shadows are expensive on mobile
      // could add it to container so shadow inside container 
      // then cache the container but might not be worth it
      if (!mob) piece.sha("rgba(0,0,0,.4)", 5, 5, 5);
    });

    // scramble location     
    piece.loc(padding + w / 2 + rand(stageW - w - padding * 2) - pieces.x, padding + h / 2 + rand(stageH - h - padding * 2) - pieces.y);
  });


  // ~~~~~~~~~~~~~~~~~~~~~
  // EMITTER

  const emitter = new Emitter({
    obj: new Poly({ min: 40, max: 70 }, [5, 6], .5, [orange, blue, green]),
    num: 2,
    force: 6,
    startPaused: true });



  // ~~~~~~~~~~~~~~~~~~~~~
  // MESSAGE LABEL

  const num = numX * numY;
  let placed = 0;
  STYLE = { color: blue.darken(.3), size: 24 };
  const stats = new Label({
    text: `Helyére került ${placed} puzzle darab a ${num}ből`,
    italic: true,
    align: CENTER }).
  centerReg().pos(0, 30, CENTER, BOTTOM);


  // ~~~~~~~~~~~~~~~~~~~~~
  // TEST FOR PIECE IN RIGHT PLACE AND END 

  function test(piece) {
    piece.sha(-1);
    let box = hint.items[piece.tileNum].box;
    if (piece.rotation % 360 == 0 && box.hitTestReg(piece)) {
      piece.loc(box).bot().noMouse();
      emitter.loc(box).spurt(30);
      placed++;
      if (placed == num) {
        stats.text = `Gratulálunk! Helyére került az összes elem a ${num}ből!`;
        timeout(1, function () {
          emitter.emitterForce = 8;
          emitter.center().mov(0, -170).spurt(100);
        });
        timeout(2, function () {
          hintCheck.removeFrom();
          picCheck.removeFrom();
          picCheck.checked = true;
          pieces.animate({ alpha: 0 }, .7);
          outline.animate({ alpha: 0 }, .7);
          hint.animate({ alpha: 0 }, .7);
          pic.alp(0).animate({ alpha: 1 }, .7);
          new Button({
            label: "FŐOLDAL",
            color: white,
            corner: [60, 0, 60, 0],
            backgroundColor: blue.darken(.3),
            rollBackgroundColor: blue }).

          sca(.5).
          pos(150, 30, LEFT, BOTTOM).
          alp(0).
          animate({ alpha: 1 })
          // normally just zgo("index.html") to reload 
          // but it is different in CodePen and they have disabled document.location.reload()
          // so not sure what to do... here is a the puzzle on ZIM
          .tap(() => {zgo("https://zimjs.com/puzzle", "_blank");});
        });
      } else stats.text = `Helyére került ${placed} elem${placed == 1 ? "" : ""} a ${num}ből`;
    } else stage.update();
  }

  // ~~~~~~~~~~~~~~~~~~~~~
  // CHECKBOXES AND FINISHING TOUCHES

  Style.addType("CheckBox", { borderColor: blue.darken(.3) });
  const hintCheck = new CheckBox(30, "tipp").alp(.8).pos(50, 23, LEFT, BOTTOM).wire({ target: hint, prop: "visible", input: "checked" });
  const picCheck = new CheckBox(30, "segítség").alp(.8).pos(150, 23, LEFT, BOTTOM).wire({ target: pic, prop: "visible", input: "checked" });

  new Label("ZIM JigSaw - Kattints a puzzle darabra a forgatáshoz").pos(0, 30, CENTER);
  const pixar = new Label("Kép forrása: VOLÁNBUSZ Zrt.").
  sca(.5).
  pos(77, 32, RIGHT, BOTTOM).
  hov(purple).
  tap(() => {pixar.color = blue.darken(.3);zgo("https://www.volanbusz.hu/hu", "_blank");});
  frame.madeWith().sca(.8).pos(20, 12, RIGHT);

  pieces.top(); // add pieces above everything

  stage.update(); // needed to view changes

  // DOCS FOR ITEMS USED
  // https://zimjs.com/docs.html?item=Frame
  // https://zimjs.com/docs.html?item=Container
  // https://zimjs.com/docs.html?item=Rectangle
  // https://zimjs.com/docs.html?item=Poly
  // https://zimjs.com/docs.html?item=Label
  // https://zimjs.com/docs.html?item=Button
  // https://zimjs.com/docs.html?item=CheckBox
  // https://zimjs.com/docs.html?item=tap
  // https://zimjs.com/docs.html?item=drag
  // https://zimjs.com/docs.html?item=mouse
  // https://zimjs.com/docs.html?item=noMouse
  // https://zimjs.com/docs.html?item=wire
  // https://zimjs.com/docs.html?item=hitTestReg
  // https://zimjs.com/docs.html?item=animate
  // https://zimjs.com/docs.html?item=loop
  // https://zimjs.com/docs.html?item=sha
  // https://zimjs.com/docs.html?item=pos
  // https://zimjs.com/docs.html?item=loc
  // https://zimjs.com/docs.html?item=mov
  // https://zimjs.com/docs.html?item=top
  // https://zimjs.com/docs.html?item=bot
  // https://zimjs.com/docs.html?item=ord
  // https://zimjs.com/docs.html?item=alp
  // https://zimjs.com/docs.html?item=hov
  // https://zimjs.com/docs.html?item=sca
  // https://zimjs.com/docs.html?item=addTo
  // https://zimjs.com/docs.html?item=removeFrom
  // https://zimjs.com/docs.html?item=centerReg
  // https://zimjs.com/docs.html?item=center
  // https://zimjs.com/docs.html?item=setMask
  // https://zimjs.com/docs.html?item=Tile
  // https://zimjs.com/docs.html?item=Emitter
  // https://zimjs.com/docs.html?item=Generator
  // https://zimjs.com/docs.html?item=chop
  // https://zimjs.com/docs.html?item=shuffle
  // https://zimjs.com/docs.html?item=rand
  // https://zimjs.com/docs.html?item=timeout
  // https://zimjs.com/docs.html?item=getQueryString
  // https://zimjs.com/docs.html?item=darken
  // https://zimjs.com/docs.html?item=mobile
  // https://zimjs.com/docs.html?item=zog
  // https://zimjs.com/docs.html?item=zgo
  // https://zimjs.com/docs.html?item=STYLE



}); // end of ready