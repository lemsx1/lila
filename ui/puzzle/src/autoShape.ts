import { winningChances } from 'ceval';
import { decomposeUci } from 'chess';
import { DrawShape } from 'chessground/draw';

function makeAutoShapesFromUci(uci: Uci, brush: string, modifiers?: any): DrawShape[] {
  const move = decomposeUci(uci);
  return [{
    orig: move[0],
    dest: move[1],
    brush: brush,
    modifiers: modifiers
  }];
}

export default function(opts): DrawShape[] {
  const n = opts.vm.node,
  hovering = opts.ceval.hovering(),
  color = opts.ground.state.movable.color,
  rcolor = color === 'white' ? 'black' : 'white';
  let shapes: DrawShape[] = [];
  if (hovering && hovering.fen === n.fen) shapes = shapes.concat(makeAutoShapesFromUci(hovering.uci, 'paleBlue'));
  if (opts.vm.showAutoShapes() && opts.vm.showComputer()) {
    if (n.eval) shapes = shapes.concat(makeAutoShapesFromUci(rcolor, n.eval.best, 'paleGreen'));
    if (!hovering) {
      var nextBest = opts.nextNodeBest();
      if (!nextBest && opts.ceval.enabled() && n.ceval) nextBest = n.ceval.pvs[0].moves[0];
      if (nextBest) shapes = shapes.concat(makeAutoShapesFromUci(color, nextBest, 'paleBlue'));
      if (opts.ceval.enabled() && n.ceval && n.ceval.pvs && n.ceval.pvs[1] && !(opts.vm.threatMode && n.threat && n.threat.pvs[2])) {
        n.ceval.pvs.forEach(function(pv) {
          if (pv.moves[0] === nextBest) return;
          var shift = winningChances.povDiff(color, n.ceval.pvs[0], pv);
          if (shift > 0.2 || isNaN(shift) || shift < 0) return;
          shapes = shapes.concat(makeAutoShapesFromUci(pv.moves[0], 'paleGrey', {
            lineWidth: Math.round(12 - shift * 50) // 12 to 2
          }));
        });
      }
    }
  }
  if (opts.ceval.enabled() && opts.vm.threatMode && n.threat) {
    if (n.threat.pvs[1]) {
      shapes = shapes.concat(makeAutoShapesFromUci(rcolor, n.threat.pvs[0].moves[0], 'paleRed'));
      n.threat.pvs.slice(1).forEach(function(pv) {
        var shift = winningChances.povDiff(rcolor, pv, n.threat.pvs[0]);
        if (shift > 0.2 || isNaN(shift) || shift < 0) return;
        shapes = shapes.concat(makeAutoShapesFromUci(pv.moves[0], 'paleRed', {
          lineWidth: Math.round(11 - shift * 45) // 11 to 2
        }));
      });
    } else
    shapes = shapes.concat(makeAutoShapesFromUci(rcolor, n.threat.pvs[0].moves[0], 'red'));
  }
  return shapes;
}